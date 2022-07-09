import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetGuestDto } from './guest.dto'
import { Guest } from './guest.entity'
import { GuestService } from './guest.service'

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @ApiOkResponse({ type: Guest, description: 'Guest with specified id' })
  @ApiResponse({ type: Guest, isArray: true, description: 'All guests if id is not specified' })
  @Get()
  get(@Query() { id, eventId, ticketId }: GetGuestDto) {
    if (ticketId) {
      return this.guestService.getByTicketId(ticketId)
    }

    if (eventId) {
      return this.guestService.getByEventId(eventId)
    }

    if (id) {
      return this.guestService.getBy('id', id)
    }

    throw new BadRequestException('You must specify id or eventId, or ticketId')
  }
}
