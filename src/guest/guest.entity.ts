import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Event } from '../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { AdditionalInfoDto } from './guest.dto'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Guest {
  @ApiProperty({ description: 'Guest id', example: 256 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'was he accepted to the event', example: true })
  @Column('bool', { default: false })
  isAccepted: boolean

  @ApiProperty({ description: 'was he denied to the event', example: false })
  @Column('bool', { default: false })
  denied: boolean

  @ApiProperty({ description: 'Additional info', example: () => AdditionalInfoDto, type: () => AdditionalInfoDto })
  @Column('json', { nullable: false })
  additionalInfo: AdditionalInfoDto

  @ApiProperty({ description: 'User of this Guest', example: () => User, type: () => User })
  @OneToOne(() => User)
  user: User

  @ApiProperty({ description: 'The event this guest is at', example: () => Event, type: () => Event })
  @ManyToOne(() => Event)
  event: Event

  @ApiProperty({ description: "This guest's ticket", example: () => Ticket, type: () => Ticket })
  @ManyToOne(() => Ticket)
  ticket: Ticket
}
