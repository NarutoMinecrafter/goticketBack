import axios, { AxiosInstance } from 'axios'
import {
  CardDto,
  CardNumberType,
  GetTokenData,
  SendTransactionDto,
  SendTransactionResponse,
  TokenType,
  ValidateToken
} from '../types/payment.types'

export class PaymentUtils {
  private readonly paymentRequest: AxiosInstance
  private readonly defaultBody: { password: string; TerminalNumber: string }

  constructor() {
    this.paymentRequest = axios.create({
      baseURL: 'https://pci.zcredit.co.il/ZCreditWS/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.defaultBody = {
      TerminalNumber: process.env.APIART_ZCREDIT_TERMINAL_NUMBER,
      password: process.env.APIART_ZCREDIT_PASSWORD
    }
  }

  public async createToken({ cardNumber, cardExpiry }: Omit<CardDto, 'cardCVV'>) {
    const response = await this.paymentRequest.post<ValidateToken>('Transaction/ValidateCard', {
      ...this.defaultBody,
      CardNumber: cardNumber,
      ExpDate_MMYY: cardExpiry
    })

    return response.data
  }

  public async getTokenInfo(token: TokenType) {
    const response = await this.paymentRequest.post<GetTokenData>('Token/GetTokenData', {
      ...this.defaultBody,
      Token: token
    })

    return response.data
  }

  public async sendTransaction(dto: SendTransactionDto) {
    const response = await this.paymentRequest.post<SendTransactionResponse>('Transaction/CommitFullTransaction', {
      ...this.defaultBody,
      CardNumber: dto.token,
      CVV: dto.cardCVV,
      TransactionSum: dto.transactionSum
    })

    return response.data
  }

  public static formatCard(cardNumber: CardNumberType): CardNumberType {
    return `${cardNumber.slice(0, 2)}** **** **** ${cardNumber.slice(-4)}`
  }
}