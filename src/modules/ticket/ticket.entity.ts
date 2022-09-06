import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from '../event/event.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

export enum TicketPriceTypes {
  Regular = 'regular',
  EarlyBird = 'earlyBird',
  LastChance = 'lastChance'
}

@Entity()
export class Ticket {
  @ApiProperty({ description: 'Ticket id', example: 300 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'Ticket name', example: 'VIP ticket' })
  @Column({ nullable: false })
  name!: string

  @ApiProperty({ description: 'Ticket regular price', example: 31 })
  @Column('int', { nullable: false })
  regularPrice: number

  @ApiProperty({ description: 'Regular tickets count', example: 80 })
  @Column('int', { nullable: false })
  regularCount: number

  @ApiProperty({ description: 'Ticket pre-order price', example: 30 })
  @Column('int', { nullable: true })
  earlyBirdPrice: number

  @ApiProperty({ description: 'Early Bird tickets count', example: 10 })
  @Column('int', { nullable: true })
  earlyBirdCount: number

  @ApiProperty({ description: 'Ticket last-chance price', example: 31 })
  @Column('int', { nullable: true })
  lastChancePrice: number

  @ApiProperty({ description: 'Last Chance tickets count', example: 10 })
  @Column('int', { nullable: true })
  lastChanceCount: number

  @ApiProperty({ description: 'Current price (use this field everytime)', example: 10 })
  @Column('int', { nullable: false })
  currentPrice: number

  @ApiProperty({
    description: 'Current ticket price type (regular, early bird or last chance)',
    example: TicketPriceTypes.Regular,
    enum: TicketPriceTypes
  })
  @Column('text', { nullable: false, default: TicketPriceTypes.Regular })
  currentPriceType: TicketPriceTypes

  @ApiProperty({ description: 'Ticket service charge', example: 2 })
  @Column('int', { default: 12 })
  serviceCharge: number

  @ApiProperty({ description: 'Total count of tickets', example: 30 })
  @Column('int', { nullable: false })
  totalCount!: number

  @ApiProperty({ description: 'Current count of tickets', example: 10 })
  @Column('int', { nullable: false })
  currentCount!: number

  @ApiProperty({ description: 'Tickets type', example: 'VIP' })
  @Column()
  type: string

  @ApiProperty({ description: 'Can the ticket be booked', example: 30 })
  @Column('bool', { default: true })
  canBeBooked: boolean

  @ApiProperty({ description: 'Event of this ticket', example: () => Event, type: () => Event })
  @ManyToOne(() => Event, event => event.tickets)
  event: Event

  @ApiProperty({ description: 'Guests who bought this ticket', example: () => [Guest], type: () => [Guest] })
  @OneToMany(() => Guest, guest => guest.ticket)
  guests: Guest[]

  @BeforeInsert()
  setTotalCount() {
    this.totalCount = this.regularCount + (this.earlyBirdCount || 0) + (this.lastChanceCount || 0)
    this.currentCount = this.totalCount

    this.currentPriceType = this.earlyBirdCount ? TicketPriceTypes.EarlyBird : TicketPriceTypes.Regular
    this.currentPrice = this.earlyBirdCount ? this.earlyBirdPrice : this.regularPrice
  }
}
