import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from '../event/event.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

export class RequiredAdditionalInfo {
  @ApiProperty({ description: 'Does a person have to indicate age to buy this ticket', example: true })
  isAgeRequired = false

  @ApiProperty({ description: 'Does a person have to indicate sex to buy this ticket', example: false })
  isSexRequired = false

  @ApiProperty({ description: 'Does a person have to indicate phone to buy this ticket', example: false })
  isPhoneRequired = false

  @ApiProperty({ description: 'Does a person have to indicate ID-Code to buy this ticket', example: false })
  isIDCodeRequired = false

  @ApiProperty({ description: 'Does a person have to indicate instagram link to buy this ticket', example: false })
  isInstagramRequired = false
}

export const defaultRequiredAdditionalInfo = new RequiredAdditionalInfo()

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
  @Column('int')
  serviceCharge: number

  @ApiProperty({ description: 'Number of current tickets', example: 10 })
  @Column('int', { nullable: false })
  currentCount!: number

  @ApiProperty({ description: 'Number of total tickets', example: 30 })
  @Column('int', { nullable: false })
  totalCount!: number

  @ApiProperty({ description: 'Tickets type', example: 'VIP' })
  @Column()
  type: string

  @ApiProperty({
    description: 'Is some additional info required',
    example: () => RequiredAdditionalInfo,
    type: () => RequiredAdditionalInfo
  })
  @Column('json', { default: defaultRequiredAdditionalInfo })
  requiredAdditionalInfo: RequiredAdditionalInfo

  @ApiProperty({ description: 'Can the ticket be booked', example: 30 })
  @Column('bool', { default: false })
  canBeBooked: boolean

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @Column('text', { array: true, default: [] })
  coupons: string[]

  @ApiProperty({ description: 'Event of this ticket', example: () => Event, type: () => Event })
  @ManyToOne(() => Event)
  event: Event

  @ApiProperty({ description: 'Users who bought this ticket', example: () => [Guest], type: () => [Guest] })
  @OneToMany(() => Guest, guest => guest.ticket)
  guests: Guest[]
}
