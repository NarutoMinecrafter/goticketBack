import { CreateUserDto } from './user.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { PaymentService } from '../payment/payment.service'
import { CreatePaymentDto } from '../payment/payment.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly paymentService: PaymentService
  ) {}

  async create(dto: CreateUserDto) {
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
      relations: {
        events: true,
        guests: true,
        payments: {
          formattedCardNumber: true,
          paymentCardHolder: true,
          isSelected: true
        }
      }
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
    if (!user.payments || (await this.paymentService.isCardExists(dto.cardNumber, user.payments))) {
      throw new BadRequestException('Card already exists')
    }

    await Promise.all(user.payments!.map(async payment => await this.paymentService.unselect(payment)))

    const newPayment = await this.paymentService.create(dto)

    await this.update({ ...user, payments: [...user.payments, newPayment] })

    return Boolean(true)
  }

  getPayments(id: User['id']) {
    return this.getBy('id', id).then(user => user?.payments)
  }

  getSelectedPayment(id: User['id']) {
    return this.getBy('id', id).then(user => user?.payments?.find(payment => payment.isSelected))
  }
}