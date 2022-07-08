import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTicketDto } from './ticket.dto'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'
import { User } from '../user/user.entity'

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @ApiOkResponse({ type: Ticket, description: 'Get ticket by ticketId' })
  @ApiResponse({ type: Ticket, isArray: true, description: 'Get tickets by Event id' })
  @Get()
  get(@Query() { id, ticketId }: GetTicketDto) {
    if (ticketId) {
      return this.ticketService.getBy('id', ticketId)
    }

    return this.ticketService.getById(id)
  }

  @Get('/my')
  getMyTickets(@Req() { user }: Record<'user', User>) {
    return this.ticketService.getByAuthor(user.id)
  }
}

