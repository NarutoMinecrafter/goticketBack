import { Guest } from '../guest/guest.entity'
import {
  BuyTicketsDto,
  ChangeEventDto,
  CreateEventDto,
  GetByEventIdDto,
  GetEventDto,
  GetPopularLocation
} from './event.dto'
import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../user/user.entity'
import { Event } from './event.entity'
import { Ticket } from '../ticket/ticket.entity'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Event, description: 'Created event' })
  @Post()
  create(@Body() dto: CreateEventDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.create(dto, user)
  }

  @ApiOkResponse({ type: Event, description: 'Event with specified id' })
  @ApiResponse({ type: Event, isArray: true, description: 'All events if id is not specified' })
  @Get()
  get(@Query() { id, ...dto }: GetEventDto) {
    if (id) {
      return this.eventService.getBy('id', Number(id))
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
  @Get('/popular-locations')
  getPopularLocations(@Query() { limit }: GetPopularLocation) {
    return this.eventService.getPopularLocation(limit || 5)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User, isArray: true, description: 'Current user events' })
  @Get('/me')
  getMyEvents(@Req() { user }: Record<'user', User>) {
    return this.eventService.getByAuthor(user.id)
  }

  @ApiOkResponse({ type: Ticket, description: 'Tickets by event id' })
  @Get('tickets')
  getTickets(@Query() { id }: GetByEventIdDto) {
    return this.eventService.getTicketsById(Number(id))
  }

  @ApiOkResponse({ type: Guest, description: 'Guests by event id' })
  @Get('guests')
  getGuests(@Query() { id }: GetByEventIdDto) {
    return this.eventService.getGuestsById(Number(id))
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Event, isArray: true, description: 'Get events where current user a guest' })
  @Get('guests/me')
  getEventsByGuestsAsMe(@Req() { user }: Record<'user', User>) {
    return this.eventService.getEventsByGuest(user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Guest, isArray: true, description: 'Guests after buy tickets' })
  @Post('buy-tickets')
  buyTickets(@Body() dto: BuyTicketsDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.buyTickets(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean, description: 'Change event values' })
  @Put()
  change(@Body() dto: ChangeEventDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.changeEvent(dto, user)
  }
}
