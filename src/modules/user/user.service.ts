import { CreateUserDto } from './user.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { PaymentService } from '../payment/payment.service'
import { CreatePaymentDto, SelectPaymentDto } from '../payment/payment.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly paymentService: PaymentService
  ) {}

  async create(dto: CreateUserDto) {
    await Promise.all(
      ['phone', 'email', dto.IDcode && 'IDCode', dto.email && 'email'].map(async key => {
        if (key && (await this.getBy(key as keyof User, dto[key as keyof CreateUserDto]))) {
          throw new BadRequestException(`User with ${key} ${dto[key as keyof CreateUserDto]} already exist`)
        }
      })
    )

    return this.userRepository.save(this.userRepository.create(dto))
  }

  getAll() {
    return this.userRepository.find().then(users => {
      users.map(user => ({ ...user, payments: [] }))
    })
  }

  getBy(key: keyof User, value: User[keyof User]) {
    return this.userRepository.findOne({
      where: { [key]: value },
      relations: ['events', 'guests', 'payments']
    })
  }

  update(user: Partial<User> & Record<'id', User['id']>) {
    return this.userRepository.update(user.id, user)
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

  async addPayment(dto: CreatePaymentDto, user: User) {
    if (await this.paymentService.isCardExists(dto.cardNumber, user.payments)) {
      throw new BadRequestException('Card already exists')
    }

    await Promise.all(user.payments.map(async payment => await this.paymentService.unselect(payment)))

    await this.paymentService.create(dto, user)

    return Boolean(true)
  }

  async removePayment(id: number, user: User) {
    const payment = user.payments.find(payment => payment.id === id)

    if (!payment) {
      throw new Error('Payment not found')
    }

    user.payments = user.payments.filter(p => p.id !== payment.id)

    await this.paymentService.delete(payment.id)

    await this.userRepository.save(user)

    return Boolean(true)
  }

  async selectPayment({ id }: SelectPaymentDto, user: User) {
    return await this.paymentService.select(id, user)
  }

  getPayments(id: User['id']) {
    return this.getBy('id', id).then(user => user?.payments)
  }

  getSelectedPayment(id: User['id']) {
    return this.getBy('id', id).then(user => user?.payments?.find(payment => payment.isSelected))
  }
}
