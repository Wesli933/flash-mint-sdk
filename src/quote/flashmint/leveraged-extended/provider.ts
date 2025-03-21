import { BigNumber } from '@ethersproject/bignumber'

import { ETH, InterestCompoundingETHIndex } from 'constants/tokens'
import { Exchange, type SwapData } from 'utils'
import {
  type LeveragedTokenData,
  getLeveragedTokenData,
} from 'utils/leveraged-token-data'
import { slippageAdjustedTokenAmount } from 'utils/slippage'

import { getRpcProvider } from 'utils/rpc-provider'
import type { QuoteProvider, QuoteToken } from '../../interfaces'
import type { SwapQuoteProvider, SwapQuoteRequest } from '../../swap'

export interface FlashMintLeveragedExtendedQuoteRequest {
  isMinting: boolean
  inputToken: QuoteToken
  outputToken: QuoteToken
  indexTokenAmount: BigNumber
  slippage: number
}

export interface FlashMintLeveragedExtendedQuote {
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
}

export class LeveragedExtendedQuoteProvider
  implements
    QuoteProvider<
      FlashMintLeveragedExtendedQuoteRequest,
      FlashMintLeveragedExtendedQuote
    >
{
  constructor(
    private readonly rpcUrl: string,
    private readonly swapQuoteProvider: SwapQuoteProvider,
  ) {}

  async getQuote(
    request: FlashMintLeveragedExtendedQuoteRequest,
  ): Promise<FlashMintLeveragedExtendedQuote | null> {
    const provider = getRpcProvider(this.rpcUrl)
    const { indexTokenAmount, inputToken, isMinting, outputToken, slippage } =
      request
    const indexToken = isMinting ? outputToken : inputToken
    const indexTokenSymbol = indexToken.symbol
    const sources = [Exchange.Sushiswap, Exchange.UniV3]
    const network = await provider.getNetwork()
    const chainId = network.chainId
    const leveragedTokenData = await getLeveragedTokenData(
      indexToken.address,
      indexTokenAmount,
      indexTokenSymbol,
      isMinting,
      chainId,
      provider,
    )
    if (leveragedTokenData === null) return null
    const debtCollateralResult = isMinting
      ? await this.getSwapDataDebtToCollateral(
          leveragedTokenData,
          sources,
          slippage,
          chainId,
        )
      : await this.getSwapDataCollateralToDebt(
          leveragedTokenData,
          sources,
          slippage,
          chainId,
        )
    if (!debtCollateralResult) return null
    const { collateralObtainedOrSold } = debtCollateralResult
    const { swapDataDebtCollateral } = debtCollateralResult
    // Relevant when issuing
    const collateralShortfall = leveragedTokenData.collateralAmount.sub(
      collateralObtainedOrSold,
    )
    // Relevant when redeeming
    const leftoverCollateral = leveragedTokenData.collateralAmount.sub(
      collateralObtainedOrSold,
    )
    const inputOutputTokenAddress = getPaymentTokenAddress(
      isMinting ? inputToken.address : outputToken.address,
      isMinting ? inputToken.symbol : outputToken.symbol,
    )
    const { swapDataPaymentToken, paymentTokenAmount } =
      await this.getSwapDataAndPaymentTokenAmount(
        indexTokenSymbol,
        leveragedTokenData.collateralToken,
        collateralShortfall,
        leftoverCollateral,
        inputOutputTokenAddress,
        isMinting,
        slippage,
        sources,
        chainId,
      )

    const estimatedInputOutputAmount = paymentTokenAmount
    const inputOuputTokenDecimals = isMinting
      ? inputToken.decimals
      : outputToken.decimals
    const inputOutputTokenAmount = slippageAdjustedTokenAmount(
      estimatedInputOutputAmount,
      inputOuputTokenDecimals,
      slippage,
      isMinting,
    )
    return {
      inputTokenAmount: isMinting ? inputOutputTokenAmount : indexTokenAmount,
      outputTokenAmount: isMinting ? indexTokenAmount : inputOutputTokenAmount,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
    }
  }

  // Used for redeeming (buy debt, sell collateral)
  // Returns collateral amount needed to be sold
  private async getSwapDataCollateralToDebt(
    leveragedTokenData: LeveragedTokenData,
    includeSources: Exchange[],
    slippage: number,
    chainId: number,
  ) {
    const quoteRequest: SwapQuoteRequest = {
      chainId,
      inputToken: leveragedTokenData.collateralToken,
      outputToken: leveragedTokenData.debtToken,
      outputAmount: leveragedTokenData.debtAmount.toString(),
      slippage,
      sources: includeSources,
    }
    const result = await this.swapQuoteProvider.getSwapQuote(quoteRequest)
    if (!result || !result.swapData) return null
    const { inputAmount, swapData } = result
    const collateralSold = BigNumber.from(inputAmount)
    return {
      swapDataDebtCollateral: swapData,
      collateralObtainedOrSold: collateralSold,
    }
  }

  // Used for minting (buy collateral, sell debt)
  // Returns collateral amount bought
  private async getSwapDataDebtToCollateral(
    leveragedTokenData: LeveragedTokenData,
    includeSources: Exchange[],
    slippage: number,
    chainId: number,
  ) {
    const quoteRequest: SwapQuoteRequest = {
      chainId,
      inputToken: leveragedTokenData.debtToken,
      outputToken: leveragedTokenData.collateralToken,
      inputAmount: leveragedTokenData.debtAmount.toString(),
      slippage,
      sources: includeSources,
    }
    const result = await this.swapQuoteProvider.getSwapQuote(quoteRequest)
    if (!result || !result.swapData) return null
    const { outputAmount, swapData } = result
    const collateralObtained = BigNumber.from(outputAmount)
    return {
      swapDataDebtCollateral: swapData,
      collateralObtainedOrSold: collateralObtained,
    }
  }

  private async getSwapDataAndPaymentTokenAmount(
    setTokenSymbol: string,
    collateralToken: string,
    collateralShortfall: BigNumber,
    leftoverCollateral: BigNumber,
    paymentTokenAddress: string,
    isMinting: boolean,
    slippage: number,
    includeSources: Exchange[],
    chainId: number,
  ): Promise<{
    swapDataPaymentToken: SwapData
    paymentTokenAmount: BigNumber
  }> {
    // By default the input/output swap data can be empty (as it will be ignored)
    let swapDataPaymentToken: SwapData = {
      exchange: Exchange.None,
      path: [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
      fees: [],
      pool: '0x0000000000000000000000000000000000000000',
    }

    // Default if collateral token should be equal to payment token
    let paymentTokenAmount = isMinting
      ? collateralShortfall
      : leftoverCollateral

    // Only fetch input/output swap data if collateral token is not the same as payment token
    if (
      collateralToken !== paymentTokenAddress &&
      setTokenSymbol !== InterestCompoundingETHIndex.symbol
    ) {
      const quoteRequest: SwapQuoteRequest = {
        inputToken: isMinting ? paymentTokenAddress : collateralToken,
        outputToken: isMinting ? collateralToken : paymentTokenAddress,
        chainId,
        slippage,
        sources: includeSources,
      }
      if (isMinting) {
        quoteRequest.outputAmount = paymentTokenAmount.toString()
      } else {
        quoteRequest.inputAmount = paymentTokenAmount.toString()
      }
      const result = await this.swapQuoteProvider.getSwapQuote(quoteRequest)
      if (result?.swapData) {
        const { inputAmount, outputAmount, swapData } = result
        swapDataPaymentToken = swapData
        paymentTokenAmount = isMinting
          ? BigNumber.from(inputAmount)
          : BigNumber.from(outputAmount)
      }
    }

    return { swapDataPaymentToken, paymentTokenAmount }
  }
}

function getPaymentTokenAddress(
  paymentTokenAddress: string,
  paymentTokenSymbol: string,
): string {
  if (paymentTokenSymbol === ETH.symbol) {
    return 'ETH'
  }
  return paymentTokenAddress
}
