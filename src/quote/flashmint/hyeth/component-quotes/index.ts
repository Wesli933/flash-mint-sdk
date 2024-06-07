import { BigNumber } from '@ethersproject/bignumber'
import { Address, isAddressEqual } from 'viem'

import { SwapQuoteProvider } from 'quote/swap'

import { QuoteToken } from '../../../interfaces'

import { AcrossQuoteProvider } from './across'
import { InstadappQuoteProvider } from './instadapp'
import { PendleQuoteProvider } from './pendle'

interface ComponentQuotesResult {
  componentQuotes: string[]
  inputOutputTokenAmount: bigint
}

export class ComponentQuotesProvider {
  constructor(
    readonly chainId: number,
    readonly slippage: number,
    readonly wethAddress: string,
    readonly rpcUrl: string,
    readonly swapQuoteProvider: SwapQuoteProvider
  ) {}

  isAcross(token: string) {
    return isAddressEqual(
      token as Address,
      '0x28F77208728B0A45cAb24c4868334581Fe86F95B'
    )
  }

  isInstdapp(token: string) {
    return isAddressEqual(
      token as Address,
      '0xA0D3707c569ff8C87FA923d3823eC5D81c98Be78'
    )
  }

  isPendle(token: string) {
    const pendleTokens: Address[] = [
      '0x1c085195437738d73d75DC64bC5A3E098b7f93b1',
      '0x6ee2b5E19ECBa773a352E5B21415Dc419A700d1d',
      '0xf7906F274c174A52d444175729E3fa98f9bde285',
    ]
    return pendleTokens.some((pendleToken) =>
      isAddressEqual(pendleToken, token as Address)
    )
  }

  async getComponentQuotes(
    components: string[],
    positions: BigNumber[],
    isMinting: boolean,
    inputToken: QuoteToken,
    outputToken: QuoteToken
  ): Promise<ComponentQuotesResult | null> {
    if (components.length === 0 || positions.length === 0) return null
    if (components.length !== positions.length) return null

    const { swapQuoteProvider } = this

    const inputTokenAddress = this.getTokenAddressOrWeth(inputToken)
    const outputTokenAddress = this.getTokenAddressOrWeth(outputToken)

    const quotePromises: Promise<bigint | null>[] = []

    for (let i = 0; i < components.length; i += 1) {
      const index = i
      const component = components[index]
      const amount = positions[index].toBigInt()

      if (this.isAcross(component)) {
        const acrossQuoteProvider = new AcrossQuoteProvider(
          this.rpcUrl,
          swapQuoteProvider
        )
        if (isMinting) {
          const quotePromise = acrossQuoteProvider.getDepositQuote(
            amount,
            inputTokenAddress
          )
          quotePromises.push(quotePromise)
        } else {
          const quotePromise = acrossQuoteProvider.getWithdrawQuote(
            amount,
            outputTokenAddress
          )
          quotePromises.push(quotePromise)
        }
      }

      if (this.isInstdapp(component)) {
        const instadappProvider = new InstadappQuoteProvider(
          this.rpcUrl,
          swapQuoteProvider
        )
        if (isMinting) {
          const quotePromise = instadappProvider.getMintQuote(
            component,
            amount,
            inputTokenAddress
          )
          quotePromises.push(quotePromise)
        } else {
          const quotePromise = instadappProvider.getRedeemQuote(
            component,
            amount,
            outputTokenAddress
          )
          quotePromises.push(quotePromise)
        }
      }

      if (this.isPendle(component)) {
        const pendleQuoteProvider = new PendleQuoteProvider(
          this.rpcUrl,
          swapQuoteProvider
        )
        if (isMinting) {
          const quotePromise = pendleQuoteProvider.getDepositQuote(
            component,
            amount,
            inputTokenAddress
          )
          quotePromises.push(quotePromise)
        } else {
          const quotePromise = pendleQuoteProvider.getWithdrawQuote(
            component,
            amount,
            outputTokenAddress
          )
          quotePromises.push(quotePromise)
        }
      }
    }
    const resultsWithNull = await Promise.all(quotePromises)
    const results: bigint[] = resultsWithNull.filter(
      (e): e is Exclude<typeof e, null> => e !== null
    )
    if (results.length !== resultsWithNull.length) return null
    // const componentQuotes = results.map((result) => result.callData)
    const inputOutputTokenAmount = results
      .map((result) => result)
      .reduce((prevValue, currValue) => {
        return currValue + prevValue
      })
    return {
      componentQuotes: [],
      inputOutputTokenAmount,
    }
  }

  /**
   * Returns the WETH address if token is ETH. Otherwise the token's address.
   * @param token A token of type QuoteToken.
   * @returns a token address as string
   */
  getTokenAddressOrWeth(token: QuoteToken): string {
    return token.symbol === 'ETH' ? this.wethAddress : token.address
  }
}
