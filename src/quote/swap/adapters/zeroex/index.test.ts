import 'dotenv/config'

import { ZeroExSwapQuoteProvider } from './index'

const DPI = '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b'
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const ONE = '1000000000000000000'

const default0xHeader = {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  '0x-api-key': process.env.ZEROEX_API_KEY!,
}
const indexApiHeader = {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  'X-INDEXCOOP-API-KEY': process.env.INDEX_0X_API_KEY!,
}
const index0xApiBaseUrl = process.env.INDEX_0X_API

describe('ZeroExApi', () => {
  test('building a url', async () => {
    const expectedUrl =
      'https://api.0x.org/swap/v1/quote?buyAmount=1000000000000000000&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellToken=ETH'
    const chainId = 1
    const query = new URLSearchParams({
      buyAmount: '1000000000000000000',
      buyToken: DPI,
      sellToken: 'ETH',
    }).toString()
    const zeroExApi = new ZeroExSwapQuoteProvider(null, null, indexApiHeader)
    const url = zeroExApi.buildUrl('/swap/v1/quote', query, chainId)
    expect(url).toEqual(expectedUrl)
  })

  test('building a url for optimism', async () => {
    const expectedUrl =
      'https://optimism.api.0x.org/swap/v1/quote?buyAmount=1000000000000000000&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellToken=ETH'
    const chainId = 10
    const query = new URLSearchParams({
      buyAmount: '1000000000000000000',
      buyToken: DPI,
      sellToken: 'ETH',
    }).toString()
    const zeroExApi = new ZeroExSwapQuoteProvider(null, null, indexApiHeader)
    const url = zeroExApi.buildUrl('/swap/v1/quote', query, chainId)
    expect(url).toEqual(expectedUrl)
  })

  test('building a url for polygon', async () => {
    const expectedUrl =
      'https://polygon.api.0x.org/swap/v1/quote?buyAmount=1000000000000000000&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellToken=ETH'
    const chainId = 137
    const query = new URLSearchParams({
      buyAmount: ONE,
      buyToken: DPI,
      sellToken: 'ETH',
    }).toString()
    const zeroExApi = new ZeroExSwapQuoteProvider(null, null, indexApiHeader)
    const url = zeroExApi.buildUrl('/swap/v1/quote', query, chainId)
    expect(url).toEqual(expectedUrl)
  })

  test('building a url with a different base url', async () => {
    const expectedUrl =
      'https://api.index.com/swap/v1/quote?buyAmount=1000000000000000000&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellToken=ETH'
    const baseUrl = 'https://api.index.com'
    const chainId = 10
    const query = new URLSearchParams({
      buyAmount: ONE,
      buyToken: DPI,
      sellToken: 'ETH',
    }).toString()
    const zeroExApi = new ZeroExSwapQuoteProvider(baseUrl, null, indexApiHeader)
    const url = zeroExApi.buildUrl('/swap/v1/quote', query, chainId)
    expect(url).toEqual(expectedUrl)
  })

  test('building a url with a different base url and affiliate address', async () => {
    const expectedUrl =
      'https://api.index.com/swap/v1/quote?buyAmount=1000000000000000000&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellToken=ETH&affiliateAddress=0xaffiliate'
    const affiliateAddress = '0xaffiliate'
    const baseUrl = 'https://api.index.com'
    const chainId = 10
    const query = new URLSearchParams({
      buyAmount: ONE,
      buyToken: DPI,
      sellToken: 'ETH',
    }).toString()
    const zeroExApi = new ZeroExSwapQuoteProvider(
      baseUrl,
      affiliateAddress,
      indexApiHeader,
    )
    const url = zeroExApi.buildUrl('/swap/v1/quote', query, chainId)
    expect(url).toEqual(expectedUrl)
  })

  test('getting a swap quote', async () => {
    const request = {
      chainId: 1,
      inputToken: 'ETH',
      outputToken: USDC,
      outputAmount: '1000000',
    }
    const zeroExApi = new ZeroExSwapQuoteProvider(null, null, default0xHeader)
    const quote = await zeroExApi.getSwapQuote(request)
    if (!quote) fail()
    expect(quote).not.toBeNull()
    expect(quote.inputAmount).not.toBeNull()
  })

  test('getting a swap quote - when overriding the swap path', async () => {
    const request = {
      chainId: 1,
      inputToken: 'ETH',
      outputToken: USDC,
      outputAmount: '1000000',
    }
    const zeroExApi = new ZeroExSwapQuoteProvider(
      index0xApiBaseUrl,
      '',
      indexApiHeader,
      '/mainnet/swap/v1/quote',
    )
    const quote = await zeroExApi.getSwapQuote(request)
    if (!quote) fail()
    expect(quote).not.toBeNull()
    expect(quote.inputAmount).not.toBeNull()
  })

  test('getting a swap quote fails for wrong base url', async () => {
    const request = {
      chainId: 1,
      inputToken: 'ETH',
      outputToken: USDC,
      outputAmount: '1000000',
    }
    const zeroExApi = new ZeroExSwapQuoteProvider('https://')
    const quote = await zeroExApi.getSwapQuote(request)
    expect(quote).toBeNull()
  })
})
