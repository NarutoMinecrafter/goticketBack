import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
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
import { Ticket } from '../ticket/ticket.entity'
import { Guest } from '../guest/guest.entity'
import { filesInterceptor } from './event.interceptor'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
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
  @Get('popular-locations')
  getPopularLocations(@Query() { limit }: GetPopularLocation) {
    return this.eventService.getPopularLocation(limit || 5)
  }

  @UseGuards(JwtAuthGuard)
  // @ApiResponse()
  @Post('use-ticket')
  useTicket(@Body() dto: UseTicketDto, @Req() { user }: Record<'user', User>) {
    return this.eventService.useTicket(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User, isArray: true, description: 'Current user events' })
  @Get('me')
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
}
