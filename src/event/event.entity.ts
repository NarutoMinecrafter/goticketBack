import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Ticket } from '../ticket/ticket.entity'
import { Location } from './event.dto'

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  title!: string

  @Column('text', { array: true, default: [] })
  demo!: string[]

  @Column('date', { nullable: false })
  startDate!: Date

  @Column('date')
  endDate: Date

  @CreateDateColumn()
  createDate: Date

  @Column({ nullable: false })
  shortDescription!: string

  @Column()
  fullDescription: string

  @Column({ nullable: false, type: 'json' })
  location!: Location

  @Column({ nullable: false })
  bank!: string

  @Column('bool', { default: false })
  private: boolean

  @Column('bool', { default: false })
  hide: boolean

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[]

  @ManyToOne(() => User)
  creator: User

  @ManyToMany(() => User)
  members: User[]

  @ManyToMany(() => User)
  guests: User[]
}
