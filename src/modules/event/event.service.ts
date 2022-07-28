import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { getDistance } from 'geolib'
import { scheduleJob } from 'node-schedule'
import { TicketService } from '../ticket/ticket.service'
import { User } from '../user/user.entity'
import { BuyTicketsDto, ChangeEventDto, CreateEventDto, GetEventDto, SortTypes, UseTicketDto } from './event.dto'
import { defaultRequiredAdditionalInfo, Event, TypeEnum } from './event.entity'
import { UserService } from '../user/user.service'
import { sortMap } from '../../utils/map.utils'
import { GuestService } from '../guest/guest.service'
import { PaymentStatus } from '../guest/guest.entity'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
    private readonly guestService: GuestService,
    private readonly notificationService: NotificationService
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

    const date = new Date(event.startDate)
    date.setDate(date.getDate() - 1)

    scheduleJob(event.id.toString(), date, async () => {
      const guests = (await this.getGuestsById(event.id)) || []

      const messages =
        guests
          .filter(guest => !!guest.user.pushNotificationToken)
          .map(guest => ({
            token: guest.user.pushNotificationToken as string,
            notification: {
              title: "Notification of tomorrow's event",
              body: `Starting ${event.name} tomorrow at ${date.getHours()}:${date.getMinutes()}. Don't be late!`
            },
            data: { eventId: event.id.toString() }
          })) || []

      this.notificationService.sendPushNotifications(messages)
    })

    return event
  }

  async buyTickets({ id, tickets }: BuyTicketsDto, user: User) {
    const event = await this.getBy('id', id)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    return await Promise.all(tickets.map(async ticket => await this.ticketService.buy({ ...ticket, event, user })))
  }

  async getAll({
    query,
    sortBy,
    userLocation,
    dateFrom,
    dateTo,
    dateType,
    eventType,
    placeNearInMeters,
    onlyInStock
  }: Omit<GetEventDto, 'id'>): Promise<Event[]> {
    const pattern = query && `%${query.split(' ').join('%')}%`

    const events = await this.eventRepository.find({
      relations: ['creator', 'tickets'],
      where: {
        isPrivate: false,
        isHidden: false,
        name: ILike(pattern || '%')
      }
    })

    if ((dateFrom || dateTo) && !dateType) {
      throw new BadRequestException('Date type is required for date filter')
    }

    if (placeNearInMeters && !userLocation) {
      throw new BadRequestException('User location is required for place near filtering')
    }

    const filteredEvents = events.filter(event => {
      const filtered = {
        dateFrom: true,
        dateTo: true,
        location: true,
        type: true,
        inStock: true
      }

      if (dateType && dateFrom) {
        const dateTypes = dateType!.split(',')
        const specifiedDateFrom = new Date(dateFrom)

        if (!dateTypes.includes('start') && !dateTypes.includes('creation')) {
          throw new BadRequestException('Date type is not valid. Possible values: start, creation')
        }

        if (dateTypes.includes('start')) {
          filtered.dateFrom = event.startDate.getTime() >= specifiedDateFrom.getTime()
        }

        if (dateTypes.includes('creation')) {
          filtered.dateFrom = event.createDate.getTime() >= specifiedDateFrom.getTime()
        }
      }

      if (dateType && dateTo) {
        const dateTypes = dateType!.split(',')
        const specifiedDateFrom = new Date(dateTo)

        if (!dateTypes.includes('start') && !dateTypes.includes('creation')) {
          throw new BadRequestException('Date type is not valid. Possible values: start, creation')
        }

        if (dateTypes.includes('start')) {
          filtered.dateTo = event.startDate.getTime() <= specifiedDateFrom.getTime()
        }

        if (dateTypes.includes('creation')) {
          filtered.dateTo = event.createDate.getTime() <= specifiedDateFrom.getTime()
        }
      }

      if (placeNearInMeters && userLocation) {
        const [userLatitude, userLongitude] = userLocation.split(', ')

        if (!userLatitude || !userLongitude) {
          throw new BadRequestException('User location is not valid')
        }

        const distance = getDistance(
          { latitude: event.location.lat, longitude: event.location.lon },
          { latitude: userLatitude, longitude: userLongitude }
        )

        filtered.location = distance <= Number(placeNearInMeters)
      }

      if (eventType) {
        const formattedType = eventType.split(',')

        if (!formattedType.every(type => Object.values(TypeEnum).includes(type as TypeEnum))) {
          throw new BadRequestException('Event type is not valid')
        }

        filtered.type = formattedType.every(type => event.type.includes(type as TypeEnum))
      }

      if (onlyInStock === 'true') {
        filtered.inStock = event.tickets?.some(ticket => ticket.currentCount !== 0)
      }

      return Object.values(filtered).every(value => value)
    })

    if (!sortBy) {
      return filteredEvents
    }

    if (!userLocation && sortBy === SortTypes.ByGeolocation) {
      throw new BadRequestException('User location must be defined when sorting by geolocation')
    }

    filteredEvents.sort((prev, next) => {
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

    return filteredEvents
  }

  getBy<T extends keyof Event>(key: T, value: Event[T]) {
    return this.eventRepository.findOne({
      where: { [key]: value },
      relations: ['creator', 'tickets', 'editors', 'guests']
    })
  }

  async getByAuthor(authorId: number) {
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

  async getPopularLocation(limit = 5) {
    const events = await this.eventRepository.find({ select: ['address'] })

    const cities = events.map(event => event.address.split(',')[0])

    const count = new Map<string, number>()

    cities.forEach(city => {
      count.set(city, (count.get(city) || 0) + 1)
    })

    const sortedCount = sortMap(count, (prev, next) => prev - next)
    const locations = [...sortedCount.keys()]

    return locations.slice(0, limit)
  }

  async update({ id, editors, ...dto }: ChangeEventDto, user: User) {
    const event = await this.getBy('id', id)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    if (event.creator.id !== user.id && !event.editors.some(editor => editor.id === user.id)) {
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

  getEventsByGuest(user: User) {
    return this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.guests', 'guest')
      .innerJoin('guest.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany()
  }

  async useTicket({ guestId, payByCard }: UseTicketDto, user: User) {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.guests', 'guest')
      .leftJoinAndSelect('event.creator', 'creator')
      .leftJoinAndSelect('event.editors', 'editors')
      .leftJoinAndSelect('guest.ticket', 'ticket')
      .leftJoinAndSelect('guest.user', 'user')
      .where('guest.id = :id', { id: guestId })
      .getOne()

    if (!event) {
      throw new BadRequestException(`Guest with id ${guestId} is not defined!`)
    }

    const guest = event.guests.find(guest => guest.id === guestId)!

    if (event.creator.id !== user.id && !event.editors.some(editor => editor.id === user.id)) {
      throw new BadRequestException('You do not have permission to use this ticket')
    }

    if (guest.isTicketUsed) {
      throw new BadRequestException('Ticket is already used')
    }

    if (guest.paymentStatus === PaymentStatus.BOOKED && payByCard) {
      await this.guestService.buyTicket(guest)
    }

    const result = await this.guestService.useTicket(guest.id)

    return Boolean(result.affected)
  }
}