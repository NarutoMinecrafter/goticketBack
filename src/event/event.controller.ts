import { BuyTicketsDto, CreateEventDto, GetEventDto } from './event.dto'
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../user/user.entity'
import { Event } from './event.entity'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.create(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy-tickets')
  buyTickets(@Body() dto: BuyTicketsDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.buyTickets(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Query() { id, sortBy, userLocation }: GetEventDto) {
    if (id) {
      return this.eventService.getBy('id', Number(id))
    }

    return this.eventService.getAll(sortBy, userLocation)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: () => Event })
  @Get('/me')
  getMyEvents(@Req() { user }: Record<'user', User>) {
    return this.eventService.getByAuthor(Number(user.id))
  }
}
