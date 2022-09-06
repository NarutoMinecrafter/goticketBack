import { Guest, GuestStatus, PaymentStatus } from './guest.entity'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChangeGuestStatusDto, CreateGuestDto } from './guest.dto'
import { User } from '../user/user.entity'
import { PaymentUtils } from '../../utils/payment.utils'
import { NotificationService } from '../notification/notification.service'
import { Permissions } from '../editor/editor.entity'

@Injectable()
export class GuestService {
  private readonly paymentUtils: PaymentUtils

  constructor(
    @InjectRepository(Guest) private readonly guestRepository: Repository<Guest>,
    private readonly notificationService: NotificationService
  ) {
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

  getByAuthor(id: number) {
    return this.guestRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.event', 'event')
      .leftJoinAndSelect('ticket.ticket', 'ticket')
      .leftJoinAndSelect('guest.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
  }

  async changeGuestStatus(dto: ChangeGuestStatusDto, user: User) {
    const guest = await this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.event', 'event')
      .leftJoinAndSelect('guest.ticket', 'ticket')
      .leftJoinAndSelect('guest.user', 'user')
      .leftJoinAndSelect('event.creator', 'creator')
      .leftJoinAndSelect('event.editors', 'editor')
      .andWhere('guest.id = :id', { id: dto.id })
      .getOne()

    if (!guest) {
      throw new BadRequestException('Guest not found')
    }

    const isCreator = user.id === guest.event.creator.id
    const isEditor = guest.event.editors.some(
      editor => editor.user.id === user.id && editor.permissions.includes(Permissions.GuestConfirmation)
    )

    if (!isCreator && !isEditor) {
      throw new ForbiddenException('You do not have permission to edit the guests of this event')
    }

    if (dto.status === GuestStatus.Accepted && guest.paymentStatus !== PaymentStatus.BOOKED) {
      await this.buyTicket(guest)
    }

    if (guest.user.pushNotificationToken) {
      this.notificationService.sendPushNotification({
        token: guest.user.pushNotificationToken,
        notification: {
          title: 'Change payment status',
          body: `Ticket status for ${guest.event.name} has been changed too ${dto.status}`
        },
        data: { screen: 'Tickets' }
      })
    }

    const result = await this.guestRepository.update(dto.id, { status: dto.status })

    return Boolean(result.affected)
  }

  public async buyTicket(guest: Guest) {
    const user = guest.user

    if (!user.payments?.length) {
      throw new BadRequestException('User has no payments')
    }

    const payment = user.payments.find(payment => payment.isSelected)!

    const result = await this.paymentUtils.sendTransaction({
      transactionSum: guest.ticket.currentPrice,
      cardCVV: payment.paymentCVV!,
      token: payment.paymentToken!
    })

    if (result.HasError) {
      throw new BadRequestException(`Payment error ${result.ReturnCode}: ${result.ReturnMessage}`)
    }
  }

  async useTicket(guestId: number) {
    return this.guestRepository.update(guestId, { isTicketUsed: true })
  }
}
