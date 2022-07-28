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

export interface SendTransactionDto {
  transactionSum: number
  token: TokenType
  cardCVV: string
}

export interface SendTransactionResponse {
  HasError: boolean
  ReturnCode: number
  ReturnMessage: string
  CardNumber: string
  ExpDate_MMYY: string
  CVV: string
  CardName: string
  CardIssuerCode: string
  CardFinancerCode: string
  CardBrandCode: string
  ReferenceNumber: number
  VoucherNumber: string
  ApprovalNumber: string
  ApprovalType: string
  NotePrintData: string
  NotePrintDataSeller: null
  ResultRecord: string
  IntOt_JSON: string
  IntOt: string
  TraceGUID: null
  IsTelApprovalNeeded: boolean
  Token: string
  Logs: any[]
  ClientReciept: null
  SellerReciept: null
  ClientRecieptPP: null
  SellerRecieptPP: null
  SignatureData: string
  DspBalance: null
  PinpadCommunication: object
  IntIns: object
  IsPinpadRequested: boolean
  ZCreditInvoiceReceiptResponse: null
  ZCreditPinpadReport: object
  NoteLink: null
  PanEntryMode: string
  PaymentMethod: number
}
