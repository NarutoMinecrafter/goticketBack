import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'
import { TicketController } from './ticket.controller'
import { GuestModule } from '../guest/guest.module'

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), GuestModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService]
})
export class TicketModule {}
