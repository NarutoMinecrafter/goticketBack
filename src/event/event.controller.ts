import { Guest } from './../guest/guest.entity'
import { BuyTicketsDto, CreateEventDto, GetEventDto } from './event.dto'
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../user/user.entity'
import { Event } from './event.entity'

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
  get(@Query() { id, sortBy, userLocation }: GetEventDto) {
    if (id) {
      return this.eventService.getBy('id', Number(id))
    }

    return this.eventService.getAll(sortBy, userLocation)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User, isArray: true, description: 'Current user events' })
  @Get('/me')
  getMyEvents(@Req() { user }: Record<'user', User>) {
    return this.eventService.getByAuthor(Number(user.id))
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Guest, isArray: true, description: 'Guests after buy tickets' })
  @Post('buy-tickets')
  buyTickets(@Body() dto: BuyTicketsDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.buyTickets(dto, user)
  }
}
