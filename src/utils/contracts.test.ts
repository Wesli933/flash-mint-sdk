import { ChainId } from 'constants/chains'
import {
  ExchangeIssuanceLeveragedMainnetAddress,
  ExchangeIssuanceLeveragedPolygonAddress,
  ExchangeIssuanceZeroExMainnetAddress,
  ExchangeIssuanceZeroExPolygonAddress,
  FlashMintHyEthAddress,
  FlashMintLeveragedAddress,
  FlashMintLeveragedExtendedAddress,
  FlashMintLeveragedForCompoundAddress,
  FlashMintZeroExMainnetAddress,
} from 'constants/contracts'
import {
  BTC2xFlexibleLeverageIndex,
  ETH2xFlexibleLeverageIndex,
  DiversifiedStakedETHIndex,
  InterestCompoundingETHIndex,
  wsETH2,
  GitcoinStakedETHIndex,
  LeveragedrEthStakingYield,
  CoinDeskEthTrendIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopInverseEthereumIndex,
  IndexCoopInverseBitcoinIndex,
} from 'constants/tokens'

import {
  getExchangeIssuanceLeveragedContractAddress,
  getFlashMintLeveragedContract,
  getFlashMintLeveragedForCompoundContract,
  getExchangeIssuanceZeroExContractAddress,
  getFlashMintZeroExContract,
  getFlashMintZeroExContractForToken,
  getFlashMintLeveragedContractForToken,
  getFlashMintHyEthContract,
} from './contracts'

describe('getExchangeIssuanceLeveragedContractAddress()', () => {
  test('return correct address for polygon', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedPolygonAddress
    const address = getExchangeIssuanceLeveragedContractAddress(137)
    expect(address).toEqual(expectedAddress)
  })

  test('return correct address for mainnet', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedMainnetAddress
    const address = getExchangeIssuanceLeveragedContractAddress(1)
    expect(address).toEqual(expectedAddress)
  })

  test('returns mainnet by default', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedMainnetAddress
    const address = getExchangeIssuanceLeveragedContractAddress()
    expect(address).toEqual(expectedAddress)
  })
})

describe('getFlashMintHyEthContract()', () => {
  test('return correct contract', async () => {
    const expectedAddress = FlashMintHyEthAddress
    const contract = getFlashMintHyEthContract(undefined)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })
})

describe('getFlashMintLeveragedContract()', () => {
  test('return correct address for polygon', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedPolygonAddress
    const contract = getFlashMintLeveragedContract(undefined, 137)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('return correct address for mainnet', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedMainnetAddress
    const contract = getFlashMintLeveragedContract(undefined, 1)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('returns mainnet by default', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedPolygonAddress
    const contract = getFlashMintLeveragedContract(undefined)
    expect(contract.address).toEqual(expectedAddress)
  })
})

describe('getFlashMintLeveragedForCompoundContract()', () => {
  test('returns correct contract', async () => {
    const expectedAddress = FlashMintLeveragedForCompoundAddress
    const contract = getFlashMintLeveragedForCompoundContract(undefined)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })
})

describe('getFlashMintLeveragedContractForToken()', () => {
  test('returns the regular FlashMintLeveraged contract by default (polygon)', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedPolygonAddress
    const contract = getFlashMintLeveragedContractForToken(
      InterestCompoundingETHIndex.symbol,
      undefined
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('returns FlashMintLeveraged contract for icRETH (mainnet)', async () => {
    const expectedAddress = FlashMintLeveragedAddress
    const contract = getFlashMintLeveragedContractForToken(
      LeveragedrEthStakingYield.symbol,
      undefined,
      1
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('returns the old FlashMintLeveraged contract (mainnet)', async () => {
    const expectedAddress = ExchangeIssuanceLeveragedMainnetAddress
    const contract = getFlashMintLeveragedContractForToken(
      InterestCompoundingETHIndex.symbol,
      undefined,
      1
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('returns the FlashMintLeveragedForCompound contract', async () => {
    const expectedAddress = FlashMintLeveragedForCompoundAddress
    const contract = getFlashMintLeveragedContractForToken(
      BTC2xFlexibleLeverageIndex.symbol,
      undefined,
      1
    )
    const contract2 = getFlashMintLeveragedContractForToken(
      ETH2xFlexibleLeverageIndex.symbol,
      undefined,
      1
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract2.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })
})

describe('getExchangeIssuanceZeroExContractAddress()', () => {
  test('return correct address for polygon', async () => {
    const expectedAddress = ExchangeIssuanceZeroExPolygonAddress
    const address = getExchangeIssuanceZeroExContractAddress(137)
    expect(address).toEqual(expectedAddress)
  })

  test('return correct address for mainnet', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const address = getExchangeIssuanceZeroExContractAddress(1)
    expect(address).toEqual(expectedAddress)
  })

  test('returns mainnet by default', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const address = getExchangeIssuanceZeroExContractAddress()
    expect(address).toEqual(expectedAddress)
  })

  test('returns mainnet contract by default', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const contract = getFlashMintZeroExContract(undefined)
    expect(contract.address).toEqual(expectedAddress)
  })
})

describe('getFlashMintZeroExContract()', () => {
  test('return correct contract for polygon', async () => {
    const expectedAddress = ExchangeIssuanceZeroExPolygonAddress
    const contract = getFlashMintZeroExContract(undefined, 137)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.issueExactSetFromToken).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    expect(contract.functions.redeemExactSetForToken).toBeDefined()
  })

  test('return correct contract for mainnet', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const contract = getFlashMintZeroExContract(undefined, 1)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.issueExactSetFromToken).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    expect(contract.functions.redeemExactSetForToken).toBeDefined()
  })

  test('returns mainnet contract by default', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const contract = getFlashMintZeroExContract(undefined)
    expect(contract.address).toEqual(expectedAddress)
  })
})

describe('getFlashMintZeroExContractForToken()', () => {
  test('returns Index Protocol for cdETI', async () => {
    const expectedAddress = FlashMintZeroExMainnetAddress
    const contract = getFlashMintZeroExContractForToken(
      CoinDeskEthTrendIndex.symbol,
      undefined,
      1
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.issueExactSetFromToken).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    expect(contract.functions.redeemExactSetForToken).toBeDefined()
  })

  test('returns Index Protocol for dsETH, gtcETH and wsETH2', async () => {
    const expectedAddress = FlashMintZeroExMainnetAddress
    const contract = getFlashMintZeroExContractForToken(
      DiversifiedStakedETHIndex.symbol,
      undefined,
      1
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.issueExactSetFromToken).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    expect(contract.functions.redeemExactSetForToken).toBeDefined()

    const gtcEthContract = getFlashMintZeroExContractForToken(
      GitcoinStakedETHIndex.symbol,
      undefined,
      1
    )
    expect(gtcEthContract.address).toEqual(expectedAddress)
    expect(gtcEthContract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(
      gtcEthContract.functions.getRequiredRedemptionComponents
    ).toBeDefined()
    expect(gtcEthContract.functions.issueExactSetFromETH).toBeDefined()
    expect(gtcEthContract.functions.issueExactSetFromToken).toBeDefined()
    expect(gtcEthContract.functions.redeemExactSetForETH).toBeDefined()
    expect(gtcEthContract.functions.redeemExactSetForToken).toBeDefined()

    const contract2 = getFlashMintZeroExContractForToken(
      wsETH2.symbol,
      undefined,
      1
    )
    expect(contract2.address).toEqual(expectedAddress)
    expect(contract2.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract2.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract2.functions.issueExactSetFromETH).toBeDefined()
    expect(contract2.functions.issueExactSetFromToken).toBeDefined()
    expect(contract2.functions.redeemExactSetForETH).toBeDefined()
    expect(contract2.functions.redeemExactSetForToken).toBeDefined()
  })

  test('returns Set Protocol contract as default', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const contract = getFlashMintZeroExContractForToken('', undefined)
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getRequiredIssuanceComponents).toBeDefined()
    expect(contract.functions.getRequiredRedemptionComponents).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.issueExactSetFromToken).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    expect(contract.functions.redeemExactSetForToken).toBeDefined()
  })
})

describe('BTC2X', () => {
  test('return correct contract for token - mainnet', async () => {
    const expectedAddress = FlashMintLeveragedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopBitcoin2xIndex.symbol,
      undefined
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopBitcoin2xIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})

describe('BTC3X', () => {
  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopBitcoin3xIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})

describe('ETH2X', () => {
  test('return correct contract for token - mainnet', async () => {
    const expectedAddress = FlashMintLeveragedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopEthereum2xIndex.symbol,
      undefined
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
  })

  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopEthereum2xIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})

describe('ETH3X', () => {
  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopEthereum3xIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})

describe('iBTC1x', () => {
  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopInverseBitcoinIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})

describe('iETH1x', () => {
  test('return correct contract for token - arbitrum', async () => {
    const expectedAddress = FlashMintLeveragedExtendedAddress
    const contract = getFlashMintLeveragedContractForToken(
      IndexCoopInverseEthereumIndex.symbol,
      undefined,
      ChainId.Arbitrum
    )
    expect(contract.address).toEqual(expectedAddress)
    expect(contract.functions.getLeveragedTokenData).toBeDefined()
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
    expect(contract.functions.redeemExactSetForERC20).toBeDefined()
    expect(contract.functions.redeemExactSetForETH).toBeDefined()
    // Functions specific to extended contract
    expect(contract.functions.issueExactSetFromERC20).toBeDefined()
    expect(contract.functions.issueExactSetFromETH).toBeDefined()
  })
})
