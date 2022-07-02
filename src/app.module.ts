import dotenv from 'dotenv'
import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/user.entity'
import { TicketModule } from './ticket/ticket.module'
import { Ticket } from './ticket/ticket.entity'
import { EventModule } from './event/event.module'
import { Event } from './event/event.entity'

dotenv.config()

const { PG_URL } = process.env

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: PG_URL,
      entities: [User, Ticket, Event],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    TicketModule,
    EventModule
  ]
})
export class AppModule {}
