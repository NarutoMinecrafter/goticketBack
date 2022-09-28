import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, ILike, Repository } from 'typeorm'
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
import { SexEnum } from '../user/user.dto'
import { isEmptyObject } from '../../utils/other.utils'
import { Editor, Permissions } from '../editor/editor.entity'
import { EditorService } from '../editor/editor.service'
import { TicketPriceTypes } from '../ticket/ticket.entity'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
    private readonly guestService: GuestService,
    private readonly notificationService: NotificationService,
    private readonly editorService: EditorService
  ) {}

  async create({ tickets: ticketsDto, requiredAdditionalInfo, editors, ...dto }: CreateEventDto, user: User) {
    let event = await this.eventRepository.create(dto)
    const tickets = await Promise.all(ticketsDto.map(ticket => this.ticketService.create(ticket)))

    event.creator = user
    event.tickets = tickets
    event.requiredAdditionalInfo = { ...defaultRequiredAdditionalInfo, ...requiredAdditionalInfo }

    event.editors = await Promise.all(
      editors?.map(async editor => {
        const potentialUser = await this.userService.getBy('id', editor.userId)

        if (!potentialUser) {
          throw new BadRequestException(`User with id ${editor.userId} is not defined!`)
        }

        return this.editorService.create(
          {
            userId: potentialUser.id,
            permissions: editor.permissions,
            event
          },
          user
        )
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
            data: { screen: 'EventInfo', eventId: event.id.toString() }
          })) || []

      this.notificationService.sendPushNotifications(messages)
    })

    return event
  }

  async buyTickets({ id, tickets }: BuyTicketsDto, user: User) {
    const event = await this.getById(id)

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
    onlyInStock,
    age
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
        inStock: true,
        age: true
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

        filtered.location = distance <= placeNearInMeters
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

      if (age) {
        const ages = age.split('-')
        filtered.age =
          Number(ages[0]) > event.requiredAdditionalInfo.minRequiredAge &&
          event.requiredAdditionalInfo.minRequiredAge < Number(ages[1])
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

    return filteredEvents.filter(event => new Date(event.endDate) <= new Date())
  }

  getBy<T extends keyof Event>(
    key: T,
    value: Event[T],
    relations: FindOneOptions<Event>['relations'] = ['creator', 'tickets', 'editors', 'guests']
  ) {
    return this.eventRepository.findOne({
      where: { [key]: value },
      relations
    })
  }

  private async getById(id: Event['id'], relations?: FindOneOptions<Event>['relations']) {
    const event = await this.getBy('id', id, relations)

    if (!event) {
      throw new BadRequestException(`Event with id ${id} is not defined!`)
    }

    return event
  }

  async getByAuthor(authorId: number) {
    return this.eventRepository.find({
      where: { creator: { id: authorId } },
      relations: ['creator', 'tickets', 'editors', 'guests']
    })
  }

  getTicketsById(id: Event['id']) {
    return this.getById(id).then(event => event.tickets)
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

  async update({ id, editors, tickets, ...dto }: ChangeEventDto, user: User) {
    const event = await this.getById(id, ['editors', 'tickets', 'creator'])

    const isOwner = event.creator.id === user.id
    const isEditor = event?.editors.some(editor => {
      const isThisUser = editor.user.id === user.id

      if (!isThisUser) {
        return false
      }

      if (!isEmptyObject(dto) && !editor.permissions.includes(Permissions.EditEvent)) {
        return false
      }

      if (editors && !editor.permissions.includes(Permissions.EditAccess)) {
        return false
      }

      return true
    })

    if (!isOwner && !isEditor) {
      throw new BadRequestException('You do not have permission to edit this event')
    }

    const updatedEditors: Editor[] | undefined = editors?.length
      ? await Promise.all(
          editors?.map(async editor => {
            const potentialUser = await this.userService.getBy('id', editor.userId)

            if (!potentialUser) {
              throw new BadRequestException(`User with id ${editor.userId} is not defined!`)
            }

            return this.editorService.create(
              {
                userId: potentialUser.id,
                permissions: editor.permissions,
                event
              },
              user
            )
          }) || event.editors
        )
      : undefined

    if (tickets?.length) {
      await Promise.all(
        event.tickets.map((ticket, index) => this.ticketService.update({ ...ticket, ...tickets[index - 1] }))
      )
    }

    const result = await this.eventRepository.update(id, { ...dto, editors: updatedEditors })

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
    const isCreator = user.id === event.creator.id
    const isEditor = event.editors.some(
      editor => editor.user.id === user.id && editor.permissions.includes(Permissions.QRScanner)
    )

    if (!isCreator && !isEditor) {
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

  async statisticGuestsHeader(id: Event['id']) {
    const event = await this.getById(id, ['guests.user'])
    const totalGuests = event.guests.length
    const totalWomen = event.guests.filter(item => item.user.sex === SexEnum.Women).length
    const totalMen = event.guests.filter(item => item.user.sex === SexEnum.Women).length
    const totalUnknow = totalGuests - totalWomen - totalMen

    return {
      totalGuests,
      totalWomen,
      totalMen,
      totalUnknow
    }
  }

  async statisticMoneyHeader(id: Event['id']) {
    const event = await this.getById(id, ['tickets', 'guests'])
    const totalCount = event.tickets.reduce((acc, value) => acc + value.totalCount, 0)
    const soldCount = totalCount - event.tickets.reduce((acc, value) => acc + value.currentCount, 0)
    const totalIncome = event.guests.reduce(
      (acc, value) =>
        acc + value.priceType === TicketPriceTypes.EarlyBird
          ? value.ticket.earlyBirdCount
          : value.priceType === TicketPriceTypes.LastChance
          ? value.ticket.lastChancePrice
          : value.ticket.regularPrice,
      0
    )
    const totalBooking = event.guests.filter(item => item.paymentStatus === PaymentStatus.BOOKED).length
    const totalBuying = event.guests.length - totalBooking

    return {
      totalCount,
      soldCount,
      totalIncome,
      totalBooking,
      totalBuying
    }
  }

  async statisticPurchasedTickets(id: Event['id']) {
    const event = await this.getById(id, ['guests'])

    return event.guests.reduce((acc, value) => {
      acc[value.buyDate.toISOString()] = acc[value.buyDate.toISOString()] + value.buyCount
      return acc
    }, {} as Record<string, number>)
  }

  async statisticTotalIncome(id: Event['id']) {
    const event = await this.getById(id, ['guests.ticket'])

    return event.guests.reduce((acc, value) => {
      acc[value.buyDate.toISOString()] =
        acc[value.buyDate.toISOString()] + value.priceType === TicketPriceTypes.EarlyBird
          ? value.ticket.earlyBirdCount
          : value.priceType === TicketPriceTypes.LastChance
          ? value.ticket.lastChancePrice
          : value.ticket.regularPrice
      return acc
    }, {} as Record<string, number>)
  }

  async statisticPrices(id: Event['id']) {
    const event = await this.getById(id, ['guests'])

    const statistic = event.guests.reduce((acc, value) => {
      acc[value.priceType] = acc[value.priceType] + value.buyCount
      return acc
    }, {} as Record<TicketPriceTypes, number>)

    const totalCount = Object.keys(statistic).reduce((acc, key) => acc + statistic[key as TicketPriceTypes], 0)

    return Object.keys(statistic).reduce((acc, key) => {
      acc[key as TicketPriceTypes] = (statistic[key as TicketPriceTypes] / 100) * totalCount
      return acc
    }, {} as Record<TicketPriceTypes, number>)
  }

  async statisticTypesOfTickets(id: Event['id']) {
    const event = await this.getById(id, ['tickets'])

    return event.tickets.map(({ totalCount, currentCount, type }, _index, tickets) => ({
      [type]: {
        totalCount,
        currentCount,
        percent:
          (100 * totalCount - currentCount) /
          tickets.reduce((acc, ticket) => acc + ticket.totalCount - ticket.currentCount, 0)
      }
    }))
  }

  async statisticGuestsVisitors(id: Event['id']) {
    const event = await this.getById(id, ['guests'])

    return event.guests.reduce(
      ({ visited, dontVisited }, { isTicketUsed }) => ({
        visited: visited + (isTicketUsed ? 1 : 0),
        dontVisited: dontVisited + (isTicketUsed ? 0 : 1)
      }),
      { visited: 0, dontVisited: 0 }
    )
  }

  async statisticGuestsSex(id: Event['id']) {
    const event = await this.getById(id, ['guests.user'])

    return event.guests.reduce(
      (acc, { user }) => ({
        ...acc,
        [user.sex]: acc[user.sex] + 1
      }),
      { [SexEnum.Women]: 0, [SexEnum.Men]: 0, [SexEnum.Uknown]: 0 }
    )
  }
}
