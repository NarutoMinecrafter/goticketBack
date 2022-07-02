import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketService]
})
export class TicketModule {}
