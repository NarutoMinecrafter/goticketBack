import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { EventService } from './event.service'
import { EventController } from './event.controller'
import { UserModule } from './../user/user.module'
import { TicketModule } from './../ticket/ticket.module'

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UserModule, TicketModule],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}