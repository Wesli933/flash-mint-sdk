/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { ChainId } from 'constants/chains'
import { noopSwapData } from 'constants/swapdata'
import { IndexCoopEthereum2xIndex, USDC, WETH } from 'constants/tokens'
import { Exchange } from 'utils'
import { wei } from 'utils/numbers'

import {
  QuoteTokens,
  getLocalHostProviderUrl,
  getZeroExSwapQuoteProvider,
} from 'tests/utils'

import { LeveragedExtendedQuoteProvider } from './provider'
const rpcUrl = getLocalHostProviderUrl(ChainId.Arbitrum)
const rpcUrlBase = getLocalHostProviderUrl(ChainId.Base)
const swapQuoteProvider = getZeroExSwapQuoteProvider(ChainId.Arbitrum)
const swapQuoteProviderBase = getZeroExSwapQuoteProvider(ChainId.Base)

const { eth, usdc } = QuoteTokens

function pathContains(address: string, path: string[]): boolean {
  return path.some((addr) => addr.toLowerCase() === address.toLowerCase())
}

describe('LeveragedQuoteProvider()', () => {
  test('returns quote for ETH2X - minting w/ ETH', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: true,
      inputToken: eth,
      outputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressArbitrum!,
      },
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrl,
      swapQuoteProvider,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.outputTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
  })

  test('returns quote for ETH2X - minting w/ ERC20', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: true,
      inputToken: usdc,
      outputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressArbitrum!,
      },
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrl,
      swapQuoteProvider,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.outputTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
  })

  test('returns quote for ETH2X - redeeming to ETH', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: false,
      inputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressArbitrum!,
      },
      outputToken: eth,
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrl,
      swapQuoteProvider,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.indexTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    const swapDataOutputToken = noopSwapData
    noopSwapData.path = [
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ]
    expect(quote.swapDataPaymentToken).toStrictEqual(swapDataOutputToken)
  })

  test('returns quote for ETH2X - redeeming to USDC', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: false,
      inputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressArbitrum!,
      },
      outputToken: usdc,
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrl,
      swapQuoteProvider,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.indexTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressArbitrum!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    const swapDataOutputToken = noopSwapData
    noopSwapData.path = [
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ]
    expect(quote.swapDataPaymentToken).toStrictEqual(swapDataOutputToken)
  })
})

describe('LeveragedQuoteProvider() - Base', () => {
  test('returns quote for ETH2X - minting w/ ETH', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: true,
      inputToken: eth,
      outputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressBase!,
      },
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrlBase,
      swapQuoteProviderBase,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.outputTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
  })

  test('returns quote for ETH2X - minting w/ ERC20', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: true,
      inputToken: {
        symbol: usdc.symbol,
        decimals: usdc.decimals,
        address: USDC.addressBase!,
      },
      outputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressBase!,
      },
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrlBase,
      swapQuoteProviderBase,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.outputTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
  })

  test('returns quote for ETH2X - redeeming to ETH', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: false,
      inputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressBase!,
      },
      outputToken: eth,
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrlBase,
      swapQuoteProviderBase,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.indexTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    const swapDataOutputToken = noopSwapData
    noopSwapData.path = [
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ]
    expect(quote.swapDataPaymentToken).toStrictEqual(swapDataOutputToken)
  })

  test('returns quote for ETH2X - redeeming to USDC', async () => {
    const indexToken = IndexCoopEthereum2xIndex
    const indexTokenAmount = wei(1)
    const request = {
      isMinting: false,
      inputToken: {
        symbol: indexToken.symbol,
        decimals: 18,
        address: indexToken.addressBase!,
      },
      outputToken: usdc,
      indexTokenAmount,
      slippage: 0.5,
    }
    const quoteProvider = new LeveragedExtendedQuoteProvider(
      rpcUrlBase,
      swapQuoteProviderBase,
    )
    const quote = await quoteProvider.getQuote(request)
    if (!quote) fail()
    expect(quote.indexTokenAmount).toEqual(indexTokenAmount)
    expect(quote.inputOutputTokenAmount.gt(0)).toBe(true)
    // Testing for individual params as changing quotes could affect the results
    expect(quote.swapDataDebtCollateral.exchange).not.toBe(Exchange.None)
    expect(quote.swapDataDebtCollateral.fees.length).toBeGreaterThanOrEqual(1)
    expect(
      pathContains(USDC.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    expect(
      pathContains(WETH.addressBase!, quote.swapDataDebtCollateral.path),
    ).toBe(true)
    const swapDataOutputToken = noopSwapData
    noopSwapData.path = [
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ]
    expect(quote.swapDataPaymentToken).toStrictEqual(swapDataOutputToken)
  })
})
