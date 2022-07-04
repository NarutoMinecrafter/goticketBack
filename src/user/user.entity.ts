import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from './../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { SexEnum } from './user.dto'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  surname!: string

  @Column({ unique: true, nullable: false })
  phone!: string

  @Column({ unique: true })
  email: string

  @Column('date', { nullable: true })
  bithdate: Date

  @Column({ unique: true })
  IDcode: string

  @Column({ unique: true, nullable: true })
  instagram?: string

  @Column({ enum: SexEnum })
  sex?: SexEnum

  @Column({ nullable: true })
  avatar?: string

  @ManyToMany(() => Ticket)
  tickets: Ticket[]

  @OneToMany(() => Event, event => event.creator)
  events: Event[]
}
