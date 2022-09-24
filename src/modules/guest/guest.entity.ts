import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Event } from '../event/event.entity'
import { Ticket, TicketPriceTypes } from '../ticket/ticket.entity'
import { ApiProperty } from '@nestjs/swagger'

export enum GuestStatus {
  Accepted = 'accepted',
  Request = 'request',
  Denied = 'denied'
}

export enum PaymentStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
  PURCHASED = 'purchased'
}

@Entity()
export class Guest {
  @ApiProperty({ description: 'Guest id', example: 256 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'Was he accepted to the event', example: true })
  @Column('enum', { enum: GuestStatus, default: GuestStatus.Request })
  status: GuestStatus

  @ApiProperty({ description: 'Ticket status', example: PaymentStatus.PENDING })
  @Column('enum', { enum: PaymentStatus, nullable: false, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus

  @ApiProperty({ description: 'Is ticket used', example: true })
  @Column('bool', { default: false })
  isTicketUsed: boolean

  @ApiProperty({ description: 'Ticket buy date', example: new Date().toISOString() })
  @Column('date', { default: new Date() })
  buyDate: Date

  @ApiProperty({ description: 'Ticket buy count', example: 1 })
  @Column('int', { default: 1 })
  buyCount: number

  @ApiProperty({
    description: 'Current ticket price type (regular, early bird or last chance)',
    example: TicketPriceTypes.Regular,
    enum: TicketPriceTypes
  })
  @Column('text', { nullable: false, default: TicketPriceTypes.Regular })
  priceType: TicketPriceTypes

  @ApiProperty({ description: 'User of this Guest', example: () => User, type: () => User })
  @ManyToOne(() => User, user => user.guests)
  user: User

  @ApiProperty({ description: 'The event this guest is at', example: () => Event, type: () => Event })
  @ManyToOne(() => Event, event => event.guests)
  event: Event

  @ApiProperty({ description: "This guest's ticket", example: () => Ticket, type: () => Ticket })
  @ManyToOne(() => Ticket, ticket => ticket.guests)
  ticket: Ticket
}
