import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from '../event/event.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

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
  price: number

  @ApiProperty({ description: 'Ticket pre-order price', example: 30 })
  @Column('int')
  preOrderPrice: number

  @ApiProperty({ description: 'Ticket last-chance price', example: 31 })
  @Column('int')
  lastChancePrice: number

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
    this.currentCount = this.totalCount
  }
}
