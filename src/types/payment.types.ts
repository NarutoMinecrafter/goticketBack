export type TokenType = `${string}-${string}-${string}-${string}`

export type CardNumberType = `${string} ${string} ${string} ${string}`

export type ValidateToken = ValidateTokenSuccess | ValidateTokenError

export interface ValidateTokenSuccess {
  CardNumber: `${number}`
  ExpDate_MMYY: `${string}/${string}`
  CardName: string
  HasError: false
  ReturnCode: 0
  ReturnMessage: ''
  CardIssuerCode: string
  CardFinancerCode: string
  CardBrandCode: string
  Token: TokenType
}

export interface ValidateTokenError {
  CardNumber: null
  ExpDate_MMYY: null
  CardName: null
  HasError: true
  ReturnCode: number
  ReturnMessage: string
  CardIssuerCode: null
  CardFinancerCode: null
  CardBrandCode: null
  Token: null
}

export type GetTokenData = GetTokenDataSuccess | GetTokenDataError

export interface GetTokenDataSuccess {
  HasError: false
  ReturnCode: 0
  ReturnMessage: ''
  CardNumber: CardNumberType
  ExpDate: string
  HolderID: string
}

export interface GetTokenDataError {
  HasError: true
  ReturnCode: number
  ReturnMessage: string
  CardNumber: ''
  ExpDate: ''
  HolderID: ''
}

export interface CardDto {
  cardNumber: CardNumberType
  cardExpiry: string
  cardCVV: string
}
