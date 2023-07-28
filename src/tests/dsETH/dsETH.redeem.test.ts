import { BigNumber } from '@ethersproject/bignumber'

import { ZeroExTransactionBuilder } from 'flashmint/builders'
import { QuoteToken, ZeroExQuoteProvider } from 'quote'
import { wei } from 'utils'

import { QuoteTokens } from '../utils'
import { mint } from './dsETH.helpers'

import {
  approveErc20,
  balanceOf,
  LocalhostProvider,
  SignerAccount3,
  ZeroExApiSwapQuote,
} from '../utils'

const provider = LocalhostProvider
const signer = SignerAccount3

const { dseth, eth } = QuoteTokens

describe('FlashMintZeroEx - dsETH - redeem', () => {
  const inputToken = dseth
  const indexTokenAmount = wei('0.1')

  beforeAll(async () => {
    // Mint enought dsETH for all tests to run through
    await mint(dseth, indexTokenAmount.mul(10), 0.5, signer)
  })

  beforeEach(async () => {
    jest.setTimeout(10000000)
  })

  test.skip('redeeming to ETH', async () => {
    await redeem(inputToken, indexTokenAmount)
  })

  // test('redeeming to WETH', async () => {
  //   const outputToken = WETH9
  //   await redeemERC20(inputToken, outputToken, indexTokenAmount)
  // })

  // test('redeeming to rETH', async () => {
  //   const outputToken = RETH
  //   await redeemERC20(inputToken, outputToken, indexTokenAmount)
  // })

  // test('redeeming to sETH2', async () => {
  //   const outputToken = SETH2
  //   await redeemERC20(inputToken, outputToken, indexTokenAmount)
  // })

  // test('redeeming to stETH', async () => {
  //   const outputToken = STETH
  //   await redeemERC20(inputToken, outputToken, indexTokenAmount)
  // })

  // test('redeeming to USDC', async () => {
  //   await redeemERC20(
  //     inputToken,
  //     {
  //       address: USDC.address!,
  //       decimals: 6,
  //       symbol: USDC.symbol,
  //     },
  //     indexTokenAmount
  //   )
  // })

  // test('redeeming to wstETH', async () => {
  //   const outputToken = WSTETH
  //   await redeemERC20(inputToken, outputToken, indexTokenAmount)
  // })
})

async function redeem(
  inputToken: QuoteToken,
  indexTokenAmount: BigNumber,
  slippage = 0.5
) {
  const zeroExApi = ZeroExApiSwapQuote

  const indexToken = inputToken
  const outputToken = eth
  const isMinting = false

  const quoteProvider = new ZeroExQuoteProvider(provider, zeroExApi)
  const quote = await quoteProvider.getQuote({
    inputToken,
    outputToken,
    indexTokenAmount,
    isMinting,
    slippage,
  })
  expect(quote).toBeDefined()
  if (!quote) fail()
  expect(quote?.componentQuotes.length).toBeGreaterThan(0)
  expect(quote?.inputOutputTokenAmount).toBeDefined()
  expect(quote?.inputOutputTokenAmount).not.toBe(BigNumber.from(0))
  expect(quote?.indexTokenAmount).toEqual(indexTokenAmount)

  const previousBalance = await balanceOf(signer, indexToken.address)
  expect(previousBalance.gt(0)).toEqual(true)

  const builder = new ZeroExTransactionBuilder(provider)
  const tx = await builder.build({
    isMinting,
    indexToken: indexToken.address,
    indexTokenSymbol: indexToken.symbol,
    inputOutputToken: outputToken.address,
    inputOutputTokenSymbol: outputToken.symbol,
    indexTokenAmount,
    inputOutputTokenAmount: quote.inputOutputTokenAmount,
    componentQuotes: quote.componentQuotes,
  })

  if (!tx) fail()

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  await approveErc20(indexToken.address, tx.to!, indexTokenAmount, signer)
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  // const gasEstimate = await provider.estimateGas(tx)
  // tx.gasLimit = gasEstimate
  tx.gasLimit = 6_000_000
  const res = await signer.sendTransaction(tx)
  res.wait()

  const balance: BigNumber = await balanceOf(signer, indexToken.address)
  expect(balance.lte(previousBalance.sub(indexTokenAmount))).toEqual(true)
}

// async function redeemERC20(
//   inputToken: QuoteToken,
//   outputToken: QuoteToken,
//   indexTokenAmount: BigNumber,
//   slippage = 0.5
// ) {
//   const chainId = 1
//   const signer = SignerAccount1
//   const zeroExApi = ZeroExApiSwapQuote

//   const indexToken = inputToken
//   const isMinting = false

//   const quoteProvider = new ZeroExQuoteProvider(provider, zeroExApi)
//   const quote = await quoteProvider.getQuote({
//     inputToken,
//     outputToken,
//     indexTokenAmount,
//     isMinting,
//     slippage,
//   })
//   expect(quote).toBeDefined()
//   if (!quote) fail()
//   expect(quote?.componentQuotes.length).toBeGreaterThan(0)
//   expect(quote?.inputOutputTokenAmount).toBeDefined()
//   expect(quote?.inputOutputTokenAmount).not.toBe(BigNumber.from(0))
//   expect(quote?.indexTokenAmount).toEqual(indexTokenAmount)

//   // Get FlashMintZeroEx contract instance and issuance module (debtV2)
//   const contract = getFlashMintZeroExContractForToken(
//     indexToken.symbol,
//     signer,
//     chainId
//   )
//   const issuanceModule = getIssuanceModule(indexToken.symbol, chainId)

//   await approveErc20(
//     indexToken.address,
//     contract.address,
//     indexTokenAmount,
//     signer
//   )

//   const gasEstimate = await contract.estimateGas.redeemExactSetForToken(
//     indexToken.address,
//     outputToken.address,
//     indexTokenAmount,
//     quote.inputOutputTokenAmount,
//     quote.componentQuotes,
//     issuanceModule.address,
//     issuanceModule.isDebtIssuance
//   )

//   const indexTokenErc20 = createERC20Contract(indexToken.address, signer)
//   const outputTokenErc20 = createERC20Contract(outputToken.address, signer)
//   const previousBalanceIndexToken: BigNumber = await indexTokenErc20.balanceOf(
//     signer.address
//   )
//   const previousBalanceOutputToken: BigNumber =
//     await outputTokenErc20.balanceOf(signer.address)
//   expect(previousBalanceIndexToken.gt(0)).toEqual(true)

//   const flashMint = new FlashMintZeroEx(contract)
//   const tx = await flashMint.redeemExactSetForToken(
//     indexToken.address,
//     outputToken.address,
//     indexTokenAmount,
//     quote.inputOutputTokenAmount,
//     quote.componentQuotes,
//     issuanceModule.address,
//     issuanceModule.isDebtIssuance,
//     { gasLimit: gasEstimate }
//   )
//   if (!tx) fail()
//   tx.wait()

//   const balance: BigNumber = await indexTokenErc20.balanceOf(signer.address)
//   const balanceOutputToken: BigNumber = await outputTokenErc20.balanceOf(
//     signer.address
//   )
//   expect(balance.lt(previousBalanceIndexToken)).toEqual(true)
//   expect(balanceOutputToken.gt(previousBalanceOutputToken)).toEqual(true)
// }
