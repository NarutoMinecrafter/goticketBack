import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from '../event/event.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'
import { RequiredAdditionalInfoDto } from './ticket.dto'

export const defaultRequiredAdditionalInfo = new RequiredAdditionalInfoDto()

@Entity()
export class Ticket {
  @ApiProperty({ description: 'Ticket id', example: 300 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'Ticket name', example: 'VIP ticket' })
  @Column({ nullable: false })
  name!: string

  @ApiProperty({ description: 'Ticket price', example: 31 })
  @Column('int', { nullable: false })
  price!: number

  @ApiProperty({ description: 'Ticket minimal price', example: 30 })
  @Column('int')
  minPrice: number

  @ApiProperty({ description: 'Ticket minimal price', example: 31 })
  @Column('int')
  maxPrice: number

  @ApiProperty({ description: 'Ticket service charge', example: 2 })
  @Column('int', { default: 12 })
  serviceCharge: number

  @ApiProperty({ description: 'Totla count of tickets', example: 30 })
  @Column('int', { nullable: false })
  totalCount!: number

  @ApiProperty({ description: 'Current count of tickets', example: 10 })
  @Column('int', { nullable: false })
  currentCount!: number

  @ApiProperty({ description: 'Tickets type', example: 'VIP' })
  @Column()
  type: string

  @ApiProperty({
    description: 'Is some additional info required',
    example: () => RequiredAdditionalInfoDto,
    type: () => RequiredAdditionalInfoDto
  })
  @Column('json', { default: defaultRequiredAdditionalInfo })
  requiredAdditionalInfo: RequiredAdditionalInfoDto

  @ApiProperty({ description: 'Can the ticket be booked', example: 30 })
  @Column('bool', { default: false })
  canBeBooked: boolean

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @Column('text', { array: true, default: [] })
  coupons: string[]

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
