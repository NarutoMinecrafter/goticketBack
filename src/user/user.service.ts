import { AddCardDto, ChangeUserDto } from './user.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { getFormattedAddress } from '../utils/geolocation.utils'
import { PaymentUtils } from '../utils/payment.utils'
import { CardNumberType } from '../types/payment.types'

@Injectable()
export class UserService {
  private readonly paymentUtils: PaymentUtils

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    this.paymentUtils = new PaymentUtils()
  }

  async create(dto: Omit<User, 'id'>) {
    const existedUser = await this.userRepository.findOneBy({ phone: dto.phone })

    if (existedUser) {
      throw new BadRequestException('User already exists')
    }

    return this.userRepository.save(this.userRepository.create(dto))
  }

  getAll() {
    return this.userRepository.find().then(users => {
      users.map(user => ({ ...user, payments: [] }))
    })
  }

  getBy(key: keyof User, value: User[keyof User], includePayments?: boolean) {
    return this.userRepository.findOne({ where: { [key]: value }, relations: ['events', 'guests'] }).then(user => {
      if (!user) {
        return null
      }

      if (includePayments) {
        return user
      }

      const newUser = { ...user }

      newUser.payments = user.payments!.map(payment => ({
        formattedCardNumber: payment.formattedCardNumber,
        paymentCardHolder: payment.paymentCardHolder
      }))

      return newUser
    })
  }

  update(user: Partial<User> & Record<'id', User['id']>) {
    return this.userRepository.update(user.id, user)
  }

  async changeUser({ location, ...dto }: ChangeUserDto, user: User) {
    if (location) {
      const address = await getFormattedAddress(location)
      const result = await this.userRepository.update(user.id, {
        location,
        address,
        ...dto
      })

      return Boolean(result.affected)
    }

    const result = await this.userRepository.update(user.id, dto)

    return Boolean(result.affected)
  }

  async getById(id: number) {
    const user = await this.getBy('id', id)

    if (!user) {
      throw new Error('User not found')
    }

    user.events?.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    return user
  }

  static getUserAge(date?: Date): number {
    if (!date) {
      return 0
    }

    const now = new Date()
    const age = now.getFullYear() - date.getFullYear()

    if (now.getMonth() < date.getMonth()) {
      return age - 1
    }

    if (now.getMonth() === date.getMonth() && now.getDate() < date.getDate()) {
      return age - 1
    }

    return age
  }

  async isCardExists(cardNumber: CardNumberType, user: User) {
    return user.payments!.some(async payment => {
      const response = await this.paymentUtils.getTokenInfo(payment.paymentToken!)

      if (response.HasError) {
        throw new BadRequestException('Token is not valid')
      }

      return response.CardNumber === cardNumber
    })
  }

  async addCard(dto: AddCardDto, user: User) {
    const response = await this.paymentUtils.createToken({ cardExpiry: dto.cardExpiry, cardNumber: dto.cardNumber })

    if (response.HasError) {
      throw new BadRequestException(`Error code ${response.ReturnCode}: ${response.ReturnMessage}`)
    }

    if (await this.isCardExists(dto.cardNumber, user)) {
      throw new BadRequestException('Card already exists')
    }

    user.payments!.push({
      paymentToken: response.Token,
      paymentCVV: dto.cardCVV,
      paymentCardHolder: dto.cardHolder,
      formattedCardNumber: PaymentUtils.formatCard(dto.cardNumber)
    })

    await this.userRepository.save(user)

    return Boolean(true)
  }
}
