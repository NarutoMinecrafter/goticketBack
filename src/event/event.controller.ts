import { CreateEventDto, GetEventByUserId, GetEventDto } from './event.dto'
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../user/user.entity'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.create(dto, user)
  }

  @Get()
  get(@Query() { id, sortBy, userLocation }: GetEventDto) {
    if (id) {
      return this.eventService.getBy('id', Number(id))
    }

    return this.eventService.getAll(sortBy, userLocation)
  }

  @Get('/user/:id')
  getMyEvents(@Param() params: GetEventByUserId) {
    return this.eventService.getByAuthor(Number(params.id))
  }
}
