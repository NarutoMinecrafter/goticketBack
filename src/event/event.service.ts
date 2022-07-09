import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TicketService } from '../ticket/ticket.service'
import { User } from '../user/user.entity'
import { BuyTicketsDto, ChangeEventDto, CreateEventDto, SortTypes, StringLocation } from './event.dto'
import { defaultRequiredAdditionalInfo, Event } from './event.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly ticketService: TicketService,
    private readonly userService: UserService
  ) {}

  async create({ tickets: ticketsDto, requiredAdditionalInfo, editors, ...dto }: CreateEventDto, user: User) {
    let event = await this.eventRepository.create(dto)
    const tickets = await Promise.all(ticketsDto.map(ticket => this.ticketService.create(ticket)))

    event.creator = user
    event.tickets = tickets
    event.requiredAdditionalInfo = { ...defaultRequiredAdditionalInfo, ...requiredAdditionalInfo }

    event.editors = await Promise.all(
      editors?.map(async editor => {
        const user = await this.userService.getBy('id', editor)

        if (!user) {
          throw new BadRequestException(`User with id ${editor} is not defined!`)
        }

        return user
      }) || []
    )
    event.guests = []

    event = await this.eventRepository.save(event)
    console.log(9)
    return event
  }

  async buyTickets({ id, tickets }: BuyTicketsDto, user: User) {
    const event = await this.getBy('id', id)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    return await Promise.all(tickets.map(async ticket => await this.ticketService.buy({ ...ticket, event, user })))
  }

  async getAll(sortBy?: SortTypes, userLocation?: StringLocation): Promise<Event[]> {
    const events = await this.eventRepository.find({
      relations: ['creator', 'tickets']
    })

    if (!sortBy || (sortBy === SortTypes.ByGeolocation && !userLocation)) {
      return events
    }

    events.sort((prev, next) => {
      switch (sortBy) {
        case SortTypes.ByDate: {
          return prev.startDate.getTime() - next.startDate.getTime()
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

  getBy<T extends keyof Event>(key: T, value: Event[T]) {
    return this.eventRepository.findOne({ where: { [key]: value }, relations: ['creator', 'tickets'] })
  }

  async getByAuthor(authorId: number) {
    return this.eventRepository.createQueryBuilder('event').where('event.creator.id = :id', { id: authorId }).getMany()
  }

  getTicketsById(id: number) {
    return this.getBy('id', id).then(event => event?.tickets)
  }

  getGuestsById(id: number) {
    return this.getBy('id', id).then(event => event?.guests)
  }

  async changeEvent({ id, editors, ...dto }: ChangeEventDto, user: User) {
    const event = await this.getBy('id', id)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    if (event.creator.id !== user.id || !event.editors.some(editor => editor.id === user.id)) {
      throw new BadRequestException('You do not have permission to edit this event')
    }

    const users = await Promise.all(
      editors?.map(async editor => {
        const user = await this.userService.getBy('id', editor)

        if (!user) {
          throw new BadRequestException(`User with id ${editor} is not defined!`)
        }

        return user
      }) || event.editors
    )

    const result = await this.eventRepository.update(id, { ...dto, editors: users })

    return Boolean(result.affected)
  }
}
