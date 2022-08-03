import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetByTicketIdDto, GetTicketDto } from './ticket.dto'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'
import { User } from '../user/user.entity'
import { Guest } from '../guest/guest.entity'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @ApiOkResponse({ type: Ticket, description: 'Get ticket by ticketId' })
  @ApiResponse({ type: Ticket, isArray: true, description: 'Get tickets by Event id' })
  @Get()
  get(@Query() { id }: GetTicketDto) {
    if (id) {
      return this.ticketService.getBy('id', id)
    }

    return this.ticketService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Ticket, isArray: true, description: 'Get user tickets' })
  @Get('/my')
  getMyTickets(@Req() { user }: Record<'user', User>) {
    return this.ticketService.getByAuthor(user.id)
  }

  @ApiOkResponse({ type: Guest, description: 'Guests by ticket id' })
  @Get('guests')
  getGuests(@Query() { id }: GetByTicketIdDto) {
    return this.ticketService.getGuestsById(id)
  }
}
