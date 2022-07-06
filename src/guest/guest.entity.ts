import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Event } from './../event/event.entity'
import { Ticket } from './../ticket/ticket.entity'
import { AdditionalInfoDto } from './guest.dto'

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id!: Number

  @Column('bool', { default: false })
  accepted: boolean

  @Column('bool', { default: false })
  denyed: boolean

  @Column('json', { nullable: false })
  additionalInfo: AdditionalInfoDto

  @OneToOne(() => User)
  user: User

  @ManyToOne(() => Event)
  event: Event

  @ManyToOne(() => Ticket)
  ticket: Ticket
}
