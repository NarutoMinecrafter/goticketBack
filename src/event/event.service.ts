import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TicketService } from '../ticket/ticket.service'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { BuyTicketsDto, CreateEventDto, SortTypes, StringLocation } from './event.dto'
import { Event } from './event.entity'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly userService: UserService,
    private readonly ticketService: TicketService
  ) {}

  async create({ tickets: ticketsDto, ...dto }: CreateEventDto, user: User) {
    const event = await this.eventRepository.save(this.eventRepository.create(dto))

    const tickets = await Promise.all(ticketsDto.map(ticket => this.ticketService.create(ticket)))

    event.tickets = tickets

    await this.userService.update({ ...user, events: [...user.events, event] })

    return event
  }

  async buyTickets({ id, tickets }: BuyTicketsDto, user: User) {
    const event = await this.getBy('id', id)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    tickets.forEach(async ticket => await this.ticketService.buy({ ...ticket, event, user }))
  }

  async getAll(sortBy?: SortTypes, userLocation?: StringLocation): Promise<Event[]> {
    const events = await this.eventRepository.find()

    if (!sortBy || (sortBy === SortTypes.ByGeolocation && !userLocation)) {
      return events
    }

    events.sort((prev, next) => {
      switch (sortBy) {
        case SortTypes.ByDate: {
          console.log(prev)
          return new Date(prev.startDate).getTime() - new Date(next.startDate).getTime()
        }
        case SortTypes.ByTicketsCount: {
          return prev.tickets?.length || 0 - next.tickets?.length || 0
        }
        case SortTypes.ByGeolocation: {
          // TODO: implement geolocation sorting
          return 0
        }
        case SortTypes.ByCreateDate: {
          return new Date(prev.createDate).getTime() - new Date(next.createDate).getTime()
        }
      }

      return 0
    })

    return events
  }

  getBy(key: keyof Event, value: Event[keyof Event]) {
    return this.eventRepository.findOneBy({ [key]: value })
  }

  async getByAuthor(authorId: number) {
    return this.eventRepository.createQueryBuilder('event').where('event.creator.id = :id', { id: authorId }).getOne()
  }
}
