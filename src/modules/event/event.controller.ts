import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { rm } from 'fs/promises'
import { join } from 'path'
import { Body, Controller, Get, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import {
  BuyTicketsDto,
  ChangeEventDto,
  CreateEventDto,
  GetByEventIdDto,
  GetEventDto,
  GetPopularLocation,
  UseTicketDto
} from './event.dto'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../auth/auth.guard'
import { User } from '../user/user.entity'
import { Event } from './event.entity'
import { Ticket, TicketPriceTypes } from '../ticket/ticket.entity'
import { Guest } from '../guest/guest.entity'
import { filesInterceptor } from './event.interceptor'
import { SexEnum } from '../user/user.dto'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Event, description: 'Created event' })
  @Post()
  @UseInterceptors(filesInterceptor)
  create(
    @Body() dto: CreateEventDto,
    @Req() { user }: Record<'user', User>,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const demoLinks = files?.map(file => file.path.replaceAll('\\', '/'))
    return this.eventService.create(demoLinks?.length ? { ...dto, demoLinks } : dto, user)
  }

  @ApiOkResponse({ type: Event, description: 'Event with specified id' })
  @ApiResponse({ type: Event, isArray: true, description: 'All events if id is not specified' })
  @Get()
  get(@Query() { id, ...dto }: GetEventDto) {
    if (id) {
      return this.eventService.getBy('id', id)
    }

    return this.eventService.getAll(dto)
  }

  @ApiResponse({
    isArray: true,
    schema: {
      type: 'string',
      example: ['Kyiv', 'Lviv', 'Odessa']
    },
    description: 'Get popular locations'
  })
  @Get('popular-locations')
  getPopularLocations(@Query() { limit }: GetPopularLocation) {
    return this.eventService.getPopularLocation(limit || 5)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean, description: 'Use ticket' })
  @Post('use-ticket')
  useTicket(@Body() dto: UseTicketDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.useTicket(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true, description: 'Current user events' })
  @Get('me')
  getMyEvents(@Req() { user }: Record<'user', User>) {
    return this.eventService.getByAuthor(user.id)
  }

  @ApiOkResponse({ type: Ticket, description: 'Tickets by event id' })
  @Get('tickets')
  getTickets(@Query() { id }: GetByEventIdDto) {
    return this.eventService.getTicketsById(id)
  }

  @ApiOkResponse({ type: Guest, description: 'Guests by event id' })
  @Get('guests')
  getGuests(@Query() { id }: GetByEventIdDto) {
    return this.eventService.getGuestsById(id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Event, isArray: true, description: 'Get events where current user a guest' })
  @Get('guests/me')
  getEventsByGuestsAsMe(@Req() { user }: Record<'user', User>) {
    return this.eventService.getEventsByGuest(user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Guest, isArray: true, description: 'Guests after buy tickets' })
  @Post('buy-tickets')
  buyTickets(@Body() dto: BuyTicketsDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.buyTickets(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean, description: 'Change event values' })
  @Put()
  @UseInterceptors(filesInterceptor)
  async change(
    @Body() dto: ChangeEventDto,
    @Req() { user }: Record<'user', User>,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const demoLinks = files?.map(file => file.path.replaceAll('\\', '/'))

    if (demoLinks?.length) {
      const event = await this.eventService.getBy('id', dto.id)
      event?.demoLinks.forEach(async link => await rm(join(__dirname, '..', '..', '..', link)))
    }

    return this.eventService.update(demoLinks?.length ? { ...dto, demoLinks } : dto, user)
  }

  @ApiOkResponse({
    schema: { example: { totalGuests: 0, totalWomen: 0, totalMen: 0, totalUnknow: 0 } }
  })
  @Get('statistic/guests-header')
  statisticGuestsHeader(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticGuestsHeader(id)
  }

  @ApiOkResponse({
    schema: { example: { totalCount: 0, soldCount: 0, totalIncome: 0, totalBooking: 0, totalBuying: 0 } }
  })
  @Get('statistic/money-header')
  statisticMoneyHeader(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticMoneyHeader(id)
  }

  @ApiOkResponse({ schema: { example: { [new Date().toISOString()]: 1000 } } })
  @Get('statistic/purchased-tickets')
  statisticPurchasedTickets(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticPurchasedTickets(id)
  }

  @ApiOkResponse({ schema: { example: { [new Date().toISOString()]: 1000 } } })
  @Get('statistic/total-income')
  statisticTotalIncome(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticTotalIncome(id)
  }

  @ApiOkResponse({
    schema: {
      example: { [TicketPriceTypes.EarlyBird]: 30, [TicketPriceTypes.Regular]: 60, [TicketPriceTypes.LastChance]: 30 }
    }
  })
  @Get('statistic/prices')
  statisticPrices(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticPrices(id)
  }

  @ApiOkResponse({
    schema: {
      example: {
        Vip: {
          totalCount: 100,
          currentCount: 30,
          percent: 3
        },
        Standart: {
          totalCount: 100,
          currentCount: 80,
          percent: 80
        }
      }
    }
  })
  @Get('statistic/type-of-tickets')
  statisticTypesOfTickets(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticTypesOfTickets(id)
  }

  @ApiOkResponse({ schema: { example: { visited: 1000, dontVisited: 100 } } })
  @Get('statistic/guests-visitors')
  statisticGuestsVisitors(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticGuestsVisitors(id)
  }

  @ApiOkResponse({ schema: { example: { [SexEnum.Women]: 50, [SexEnum.Men]: 40, [SexEnum.Uknown]: 10 } } })
  @Get('statistic/guests-sex')
  statisticGuestsSex(@Query() { id }: GetByEventIdDto) {
    return this.eventService.statisticGuestsSex(id)
  }
}
