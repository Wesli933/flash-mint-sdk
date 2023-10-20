import { ChainId } from '../constants/chains'
import {
  BasicIssuanceModuleAddress,
  BasicIssuanceModulePolygonAddress,
  DebtIssuanceModuleAddress,
  DebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '../constants/contracts'
import {
  BTC2xFlexibleLeverageIndex,
  ETH2xFlexibleLeverageIndex,
  DiversifiedStakedETHIndex,
  InterestCompoundingETHIndex,
  MoneyMarketIndexToken,
  wsETH2,
  GitcoinStakedETHIndex,
  LeveragedrEthStakingYield,
  CoinDeskEthTrendIndex,
} from '../constants/tokens'

export interface IssuanceModule {
  address: string
  isDebtIssuance: boolean
}

export function getIssuanceModule(
  tokenSymbol: string,
  chainId: number = ChainId.Mainnet
): IssuanceModule {
  if (chainId === ChainId.Polygon)
    return {
      address: BasicIssuanceModulePolygonAddress,
      isDebtIssuance: false,
    }

  // Mainnet
  switch (tokenSymbol) {
    case BTC2xFlexibleLeverageIndex.symbol:
    case ETH2xFlexibleLeverageIndex.symbol:
      return { address: DebtIssuanceModuleAddress, isDebtIssuance: true }
    case CoinDeskEthTrendIndex.symbol:
    case LeveragedrEthStakingYield.symbol:
      return {
        address: IndexDebtIssuanceModuleV2Address_v2,
        isDebtIssuance: true,
      }
    case DiversifiedStakedETHIndex.symbol:
    case GitcoinStakedETHIndex.symbol:
    case MoneyMarketIndexToken.symbol:
    case wsETH2.symbol:
      return { address: IndexDebtIssuanceModuleV2Address, isDebtIssuance: true }
    case InterestCompoundingETHIndex.symbol:
      return { address: DebtIssuanceModuleV2Address, isDebtIssuance: true }
    default:
      return { address: BasicIssuanceModuleAddress, isDebtIssuance: false }
  }
}
