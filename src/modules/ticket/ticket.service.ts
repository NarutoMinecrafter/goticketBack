import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GuestService } from '../guest/guest.service'
import { BuyTicketDto, CreateTicketDto } from './ticket.dto'
import { Ticket, TicketPriceTypes } from './ticket.entity'
import { UserService } from '../user/user.service'
import { PaymentStatus } from '../guest/guest.entity'

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly guestService: GuestService
  ) {}

  create(dto: CreateTicketDto) {
    return this.ticketRepository.save(this.ticketRepository.create(dto))
  }

  getAll() {
    return this.ticketRepository.find()
  }

  getBy<T extends keyof Ticket>(key: T, value: Ticket[T]) {
    return this.ticketRepository.findOneBy({ [key]: value })
  }

  getGuestsById(id: number) {
    return this.ticketRepository
      .findOne({
        where: { id },
        relations: ['guests', 'guests.user']
      })
      .then(event => event?.guests)
  }

  update(ticket: Partial<Ticket> & Record<'id', Ticket['id']>) {
    return this.ticketRepository.update(ticket.id, ticket)
  }

  async buy({ id, count, user, event, isBooking }: BuyTicketDto) {
    const ticket = await this.getBy('id', id)

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${id} is not defined!`)
    }

    if (ticket.currentCount === 0) {
      throw new BadRequestException(`Ticket "${ticket.name}" is sold out!`)
    }

    const { isAgeRequired, minRequiredAge, isSexRequired, isIDCodeRequired, isInstagramRequired } =
      event.requiredAdditionalInfo
    const { name, phone, sex, IDcode, instagram } = user
    console.log(isAgeRequired)

    const age = UserService.getUserAge(user.birthdate)

    if (!name) {
      throw new BadRequestException('Name not found')
    }

    if (!phone) {
      throw new BadRequestException('Phone not found')
    }

    // if ((isAgeRequired || minRequiredAge) && !age) {
    //   throw new BadRequestException('Age not found')
    // }

    if (isSexRequired && !sex) {
      throw new BadRequestException('Sex not found')
    }

    if (isIDCodeRequired && !IDcode) {
      throw new BadRequestException('ID-Code not found')
    }

    if (isInstagramRequired && !instagram) {
      throw new BadRequestException('Instagram not found')
    }

    if (minRequiredAge && age && age <= minRequiredAge) {
      throw new BadRequestException(`You must be at least ${minRequiredAge} years of age to purchase a ticket`)
    }

    if (isBooking && !ticket.canBeBooked) {
      throw new BadRequestException('This ticket is not available for booking')
    }

    ticket.currentCount -= count

    let priceType: TicketPriceTypes = TicketPriceTypes.Regular

    if (ticket.earlyBirdCount > 0) {
      ticket.earlyBirdCount -= count
      priceType = TicketPriceTypes.EarlyBird

      if (ticket.earlyBirdCount === 0) {
        ticket.currentPrice = ticket.regularPrice
        ticket.currentPriceType = TicketPriceTypes.Regular
        priceType = TicketPriceTypes.Regular
      }
    } else if (ticket.regularCount > 0) {
      ticket.regularCount -= count

      if (ticket.regularCount === 0) {
        ticket.currentPrice = ticket.lastChancePrice
        ticket.currentPriceType = TicketPriceTypes.LastChance
        priceType = TicketPriceTypes.LastChance
      }
    } else if (ticket.lastChanceCount > 0) {
      ticket.lastChanceCount -= count
      ticket.currentPrice = ticket.lastChancePrice
    }

    if (ticket.earlyBirdCount < 0 || ticket.regularCount < 0 || ticket.lastChanceCount < 0) {
      throw new BadRequestException('Not enough tickets')
    }

    const paymentStatus = isBooking ? PaymentStatus.BOOKED : PaymentStatus.PENDING

    await this.update(ticket)

    return await this.guestService.create({ user, event, ticket, buyCount: count, priceType, paymentStatus })
  }

  getByAuthor(id: number) {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.event', 'event')
      .leftJoinAndSelect('ticket.guests', 'guest')
      .leftJoinAndSelect('guest.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
  }
}
