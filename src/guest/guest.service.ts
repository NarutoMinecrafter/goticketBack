import { Guest } from './guest.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateGuestDto } from './guest.dto'
import { EventService } from '../event/event.service'
import { TicketService } from '../ticket/ticket.service'

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest) private readonly guestRepository: Repository<Guest>,
    private readonly eventService: EventService,
    private readonly ticketService: TicketService
  ) {}

  create(dto: CreateGuestDto) {
    return this.guestRepository.save(this.guestRepository.create(dto))
  }

  getAll() {
    return this.guestRepository.find()
  }

  getBy(key: keyof Guest, value: Guest[keyof Guest]) {
    return this.guestRepository.findOneBy({ [key]: value })
  }

  async getByEventId(eventId: number) {
    const event = await this.eventService.getBy('id', eventId)

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} is not defined!`)
    }

    return event.guests
  }

  async getByTicketId(ticketId: number) {
    const ticket = await this.ticketService.getBy('id', ticketId)

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} is not defined!`)
    }

    return ticket.guests
  }
}

