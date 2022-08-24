import dotenv from 'dotenv'
import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { User } from './modules/user/user.entity'
import { TicketModule } from './modules/ticket/ticket.module'
import { Ticket } from './modules/ticket/ticket.entity'
import { EventModule } from './modules/event/event.module'
import { Event } from './modules/event/event.entity'
import { GuestModule } from './modules/guest/guest.module'
import { Guest } from './modules/guest/guest.entity'
import { NotificationModule } from './modules/notification/notification.module'
import { PaymentModule } from './modules/payment/payment.module'
import { Payment } from './modules/payment/payment.entity'
import { BankModule } from './modules/bank/bank.module'
import { BankAccount } from './modules/bank/bank.entity'
import { EditorModule } from './modules/editor/editor.module'
import { Editor } from './modules/editor/editor.entity'

dotenv.config()

const { PG_URL } = process.env

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: PG_URL,
      entities: [User, Ticket, Event, Guest, Payment, BankAccount, Editor],
      synchronize: true
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static'), serveRoot: '/static' }),
    UserModule,
    AuthModule,
    TicketModule,
    EventModule,
    GuestModule,
    NotificationModule,
    PaymentModule,
    BankModule,
    EditorModule
  ]
})
export class AppModule {}
