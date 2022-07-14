import { Guest, GuestStatus, PaymentStatus } from './guest.entity'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChangeGuestStatusDto, CreateGuestDto } from './guest.dto'
import { User } from '../user/user.entity'
import { PaymentUtils } from '../utils/payment.utils'

@Injectable()
export class GuestService {
  private readonly paymentUtils: PaymentUtils

  constructor(@InjectRepository(Guest) private readonly guestRepository: Repository<Guest>) {
    this.paymentUtils = new PaymentUtils()
  }

  create(dto: CreateGuestDto) {
    return this.guestRepository.save(this.guestRepository.create(dto))
  }

  getBy<T extends keyof Guest>(key: T, value: Guest[T]) {
    return this.guestRepository.find({ where: { [key]: value }, relations: ['event', 'user', 'ticket'] })
  }

  getByEventId(eventId: number) {
    return this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.user', 'user')
      .leftJoinAndSelect('guest.ticket', 'ticket')
      .innerJoin('guest.event', 'event')
      .where('event.id = :id', { id: eventId })
      .getMany()
  }

  async changeGuestStatus(dto: ChangeGuestStatusDto, user: User) {
    const guest = await this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.event', 'event')
      .leftJoinAndSelect('guest.ticket', 'ticket')
      .leftJoinAndSelect('event.creator', 'user')
      .leftJoinAndSelect('event.editors', 'editor')
      .andWhere('guest.id = :id', { id: dto.id })
      .getOne()

    if (!guest) {
      throw new BadRequestException('Guest not found')
    }

    if (guest.event.creator.id !== user.id && !guest.event.editors.some(editor => editor.id === user.id)) {
      throw new ForbiddenException('You are not the owner of this event')
    }

    if (dto.status === GuestStatus.Accepted && guest.paymentStatus !== PaymentStatus.BOOKED) {
      if (!user.payments?.length) {
        throw new BadRequestException('User has no payments')
      }

      const result = await this.paymentUtils.sendTransaction({
        transactionSum: guest.ticket.price,
        cardCVV: user.payments[0].paymentCVV!,
        token: user.payments[0].paymentToken!
      })

      if (result.HasError) {
        throw new BadRequestException(`Payment error ${result.ReturnCode}: ${result.ReturnMessage}`)
      }
    }

    const result = await this.guestRepository.update(dto.id, { status: dto.status })

    return Boolean(result.affected)
  }
}
