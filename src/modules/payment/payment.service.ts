import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { CardNumberType } from '../../types/payment.types'
import { PaymentUtils } from '../../utils/payment.utils'
import { CreatePaymentDto } from './payment.dto'
import { Payment } from './payment.entity'
import { User } from '../user/user.entity'

@Injectable()
export class PaymentService {
  private readonly paymentUtils: PaymentUtils

  constructor(@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>) {
    this.paymentUtils = new PaymentUtils()
  }

  async isCardExists(cardNumber: CardNumberType, payments: Payment[]) {
    const values = await Promise.all(
      payments.map(async payment => {
        const response = await this.paymentUtils.getTokenInfo(payment.paymentToken!)

        if (response.HasError) {
          throw new BadRequestException('Token is not valid')
        }

        return response.CardNumber === cardNumber
      })
    )

    return values.some(value => value)
  }

  async create(dto: CreatePaymentDto, user: User) {
    const response = await this.paymentUtils.createToken({ cardExpiry: dto.cardExpiry, cardNumber: dto.cardNumber })

    if (response.HasError) {
      throw new BadRequestException(`Error code ${response.ReturnCode}: ${response.ReturnMessage}`)
    }

    return this.paymentRepository.save(
      this.paymentRepository.create({
        paymentToken: response.Token,
        paymentCVV: dto.cardCVV,
        paymentCardHolder: dto.cardHolder,
        formattedCardNumber: PaymentUtils.formatCard(dto.cardNumber),
        user
      })
    )
  }

  update(payment: Partial<Payment> & Record<'id', Payment['id']>) {
    return this.paymentRepository.update(payment.id, payment)
  }

  async select(paymentId: number, user: User): Promise<UpdateResult[]> {
    const payments = user.payments.map(payment => ({ ...payment, isSelected: payment.id === paymentId }))

    return await Promise.all(payments.map(async payment => await this.update(payment)))
  }

  unselect(payment: Payment): Promise<UpdateResult> | void {
    if (payment.isSelected) {
      return this.update({ ...payment, isSelected: false })
    }
  }

  delete(id: Payment['id']) {
    return this.paymentRepository.delete(id)
  }
}
