import { CreateEventDto, GetEventByUserId, GetEventDto } from './event.dto'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EventService } from './event.service'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto)
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
