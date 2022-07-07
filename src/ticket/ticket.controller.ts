import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTicketDto } from './ticket.dto'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @ApiOkResponse({ type: Ticket, description: 'Ticket with specified id' })
  @ApiResponse({ type: Ticket, isArray: true, description: 'All tickets if id is not specified' })
  @Get()
  get(@Query() { id }: GetTicketDto) {
    if (id) {
      return this.ticketService.getBy('id', Number(id))
    }

    return this.ticketService.getAll()
  }
}
