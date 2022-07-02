import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Ticket } from './../ticket/ticket.entity'

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  title!: string

  @Column({ array: true, length: 3, default: [] })
  demo!: string[]

  @Column('date', { nullable: false })
  startDate!: Date

  @Column('date')
  endDate: Date

  @Column({ nullable: false })
  shortDescription!: string

  @Column()
  fullDescription: string

  @Column({ nullable: false })
  address!: string

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
