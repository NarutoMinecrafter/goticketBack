import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TicketService } from '../ticket/ticket.service'
import { User } from '../user/user.entity'
import { BuyTicketsDto, ChangeEventDto, CreateEventDto, SortTypes, StringLocation } from './event.dto'
import { defaultRequiredAdditionalInfo, Event } from './event.entity'
import { UserService } from '../user/user.service'
import { getDistance } from 'geolib'

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
      relations: ['creator']
    })

    if (!sortBy) {
      return events
    }

    if (!userLocation && sortBy === SortTypes.ByGeolocation) {
      throw new BadRequestException('User location must be defined when sorting by geolocation')
    }

    events.sort((prev, next) => {
      switch (sortBy) {
        case SortTypes.ByGeolocation: {
          const [lat, lon] = userLocation!.split(', ')
          const prevDistance = getDistance({ lat, lon }, { lat: prev.location.lat, lon: prev.location.lon })
          const nextDistance = getDistance({ lat, lon }, { lat: next.location.lat, lon: next.location.lon })
          return prevDistance > nextDistance ? 1 : -1
        }
        case SortTypes.ByDate: {
          return prev.startDate.getTime() - next.startDate.getTime()
        }
        case SortTypes.ByTicketsCount: {
          return prev.tickets?.length || 0 - next.tickets?.length || 0
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
    return this.eventRepository.findOne({
      where: { [key]: value },
      relations: ['creator', 'tickets', 'editors', 'guests']
    })
  }

  async getByAuthor(authorId: number) {
    // return this.eventRepository.createQueryBuilder('event').where('event.creator.id = :id', { id: authorId }).getMany()
    return this.eventRepository.find({
      where: { creator: { id: authorId } },
      relations: ['creator', 'tickets', 'editors', 'guests']
    })
  }

  getTicketsById(id: number) {
    return this.getBy('id', id).then(event => event?.tickets)
  }

  async getGuestsById(id: number) {
    return this.eventRepository
      .findOne({
        where: { id },
        relations: ['guests', 'guests.user']
      })
      .then(event => event?.guests)
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
