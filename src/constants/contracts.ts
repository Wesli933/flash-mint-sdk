import { ChainId } from 'constants/chains'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Contracts: { [key: number]: any } = {
  [ChainId.Arbitrum]: {
    DebtIssuanceModuleV3: '0x4ac26c26116fa976352b70700af58bc2442489d8',
    FlashMintLeveragedExtended: '0xc6b3B4624941287bB7BdD8255302c1b337e42194',
  },
  [ChainId.Base]: {
    DebtIssuanceModuleV3: '0xa30E87311407dDcF1741901A8F359b6005252F22',
    FlashMintLeveragedExtended: '0xE6c18c4C9FC6909EDa546649EBE33A8159256CBE',
  },
  [ChainId.Mainnet]: {
    FlashMintWrapped: '0x5C0D0a9a0c3A0a5B591496fF894686893b69FaA2',
  },
}

// Index Protocol
export const FlashMintHyEthAddress =
  '0x940ECB16416fE52856e8653B2958Bfd556aA6A7E'

export const FlashMintLeveragedAddress =
  '0x45c00508C14601fd1C1e296eB3C0e3eEEdCa45D0'

export const FlashMintLeveragedForCompoundAddress =
  '0xeA716Ed94964Ed0126Fb2fA3b546eD7F209cC2b8'

export const FlashMintZeroExMainnetAddress =
  '0x9d648E5564B794B918d99C84B0fbf4b0bf36ce45'

export const IndexDebtIssuanceModuleV2Address =
  '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'

// Used by cdETI and icRETH only at the moment
export const IndexDebtIssuanceModuleV2Address_v2 =
  '0x04b59F9F09750C044D7CfbC177561E409085f0f3'

// Set Protocol
export const BasicIssuanceModuleAddress =
  '0xd8EF3cACe8b4907117a45B0b125c68560532F94D'

export const BasicIssuanceModulePolygonAddress =
  '0x38E5462BBE6A72F79606c1A0007468aA4334A92b'

export const DebtIssuanceModuleAddress =
  '0x39F024d621367C044BacE2bf0Fb15Fb3612eCB92'

export const DebtIssuanceModuleV2Address =
  '0x69a592D2129415a4A1d1b1E309C17051B7F28d57'

export const DebtIssuanceModuleV2PolygonAddress =
  '0xf2dC2f456b98Af9A6bEEa072AF152a7b0EaA40C9'

export const ExchangeIssuanceLeveragedMainnetAddress =
  '0x981b21A2912A427f491f1e5b9Bf9cCa16FA794e1'

export const ExchangeIssuanceLeveragedPolygonAddress =
  '0xE86636f23B502B8746A72A1Ed87d65F096E419Db'

export const ExchangeIssuanceZeroExMainnetAddress =
  '0xf42eCDC112365fF79a745B4cf7D4C266bd6E4b25'

export const ExchangeIssuanceZeroExPolygonAddress =
  '0x0F5C21d4929f6F17119f43b0c51E665f12367A19'
