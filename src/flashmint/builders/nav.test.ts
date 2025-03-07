/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { BigNumber } from '@ethersproject/bignumber'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { ChainId } from 'constants/chains'
import { Contracts } from 'constants/contracts'
import { TheUSDCYieldIndex, USDC, WETH } from 'constants/tokens'
import {
  type FlashMintNavBuildRequest,
  FlashMintNavTransactionBuilder,
} from 'flashmint/builders/nav'
import { getLocalHostProviderUrl, getTestRpcProvider } from 'tests/utils'
import { Exchange } from 'utils'
import { getFlashMintNavContract } from 'utils/contracts'
import { wei } from 'utils/numbers'

const chainId = ChainId.Mainnet
const provider = getTestRpcProvider(chainId)
const rpcUrl = getLocalHostProviderUrl(chainId)

const eth = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const hyeth = getTokenByChainAndSymbol(chainId, 'hyETH').address
const usdcAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'

const FlashMintNavAddress = Contracts[chainId].FlashMintNav

describe('FlashMintNavTransactionBuilder()', () => {
  const contract = getFlashMintNavContract(provider)

  test('returns null for invalid request (no index token)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.isMinting = true
    buildRequest.outputToken = ''
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (no input/output token)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.inputToken = ''
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (inputTokenAmount = 0)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.outputTokenAmount = BigNumber.from(0)
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (outputTokenAmount = 0)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.inputTokenAmount = BigNumber.from(0)
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (invalid swap data debt collateral - no pool)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.reserveAssetSwapData = {
      exchange: 1,
      path: ['', ''],
      fees: [],
      poolIds: [],
      pool: '',
    }
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (invalid swap data input/output token - no paths)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.reserveAssetSwapData = {
      exchange: 1,
      path: [],
      fees: [],
      poolIds: [],
      pool: '0x0000000000000000000000000000000000000000',
    }
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (invalid swap data input/output token - univ3 fees)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.reserveAssetSwapData = {
      exchange: 3,
      path: ['', '', ''],
      // For UniV3 fees.length has to be path.length - 1
      fees: [3000],
      poolIds: [],
      pool: '0x0000000000000000000000000000000000000000',
    }
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns null for invalid request (invalid path - exchange type none)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.reserveAssetSwapData = {
      exchange: 0,
      path: [],
      fees: [500],
      poolIds: [],
      pool: '0x00000000000000000000000000000000000000',
    }
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).toBeNull()
  })

  test('returns tx for correct swap data with exchange type none', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.reserveAssetSwapData = {
      exchange: 0,
      path: [],
      fees: [500],
      poolIds: [],
      pool: '0x0000000000000000000000000000000000000000',
    }
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    expect(tx).not.toBeNull()
  })

  test('returns a tx for minting icUSD (ERC20)', async () => {
    const buildRequest = createBuildRequest()
    buildRequest.isMinting = true
    const indexToken = buildRequest.outputToken
    const refTx = await contract.populateTransaction.issueSetFromExactERC20(
      indexToken,
      buildRequest.outputTokenAmount,
      buildRequest.inputToken,
      buildRequest.inputTokenAmount,
      buildRequest.reserveAssetSwapData,
    )
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    if (!tx) fail()
    expect(tx.to).toBe(FlashMintNavAddress)
    expect(tx.data).toEqual(refTx.data)
  })

  test('returns a tx for minting icUSD (ETH)', async () => {
    const buildRequest = createBuildRequest(true, eth, 'ETH')
    const indexToken = buildRequest.outputToken
    const refTx = await contract.populateTransaction.issueSetFromExactETH(
      indexToken,
      buildRequest.outputTokenAmount,
      buildRequest.reserveAssetSwapData,
      { value: buildRequest.inputTokenAmount },
    )
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    if (!tx) fail()
    expect(tx.to).toBe(FlashMintNavAddress)
    expect(tx.data).toEqual(refTx.data)
    expect(tx.value).toEqual(buildRequest.inputTokenAmount)
  })

  test('returns a tx for redeeming icUSD (ERC20)', async () => {
    const buildRequest = createBuildRequest(
      false,
      TheUSDCYieldIndex.address!,
      TheUSDCYieldIndex.symbol,
      usdcAddress,
      'USDC',
    )
    const refTx = await contract.populateTransaction.redeemExactSetForERC20(
      buildRequest.inputToken,
      buildRequest.inputTokenAmount,
      buildRequest.outputToken,
      buildRequest.outputTokenAmount,
      buildRequest.reserveAssetSwapData,
    )
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    if (!tx) fail()
    expect(tx.to).toBe(FlashMintNavAddress)
    expect(tx.data).toEqual(refTx.data)
  })

  test('returns a tx for redeeming icUSD (ETH)', async () => {
    const buildRequest = createBuildRequest(
      false,
      TheUSDCYieldIndex.address!,
      TheUSDCYieldIndex.symbol,
      eth,
      'ETH',
    )
    const refTx = await contract.populateTransaction.redeemExactSetForETH(
      buildRequest.inputToken,
      buildRequest.inputTokenAmount,
      buildRequest.outputTokenAmount,
      buildRequest.reserveAssetSwapData,
    )
    const builder = new FlashMintNavTransactionBuilder(rpcUrl)
    const tx = await builder.build(buildRequest)
    if (!tx) fail()
    expect(tx.to).toBe(FlashMintNavAddress)
    expect(tx.data).toEqual(refTx.data)
  })
})

function createBuildRequest(
  isMinting = true,
  inputToken: string = usdcAddress,
  inputTokenSymbol = 'USDC',
  outputToken: string = hyeth,
  outputTokenSymbol = 'hyETH',
): FlashMintNavBuildRequest {
  const inputSwapData = {
    exchange: Exchange.UniV3,
    path: [USDC.address!, WETH.address!],
    fees: [500],
    poolIds: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  }
  const outputSwapData = {
    exchange: Exchange.UniV3,
    path: [WETH.address!, USDC.address!],
    fees: [500],
    poolIds: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  }
  return {
    isMinting,
    inputToken,
    inputTokenSymbol,
    outputToken,
    outputTokenSymbol,
    inputTokenAmount: BigNumber.from(194235680),
    outputTokenAmount: wei(1),
    reserveAssetSwapData: isMinting ? inputSwapData : outputSwapData,
  }
}
