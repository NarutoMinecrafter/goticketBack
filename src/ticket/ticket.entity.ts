import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './../user/user.entity'
import { Event } from './../event/event.entity'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  name!: string

  @Column('int', { nullable: false })
  price!: number

  @Column('int')
  minPrice: number

  @Column('int')
  maxPrice: number

  @Column('int')
  serviceCharge: number

  @Column('int', { nullable: false })
  count!: number

  @Column('int', { nullable: false })
  totalCount!: number

  @Column()
  type: string

  @Column('bool', { default: false })
  paid: boolean

  @Column('text', { array: true, default: [] })
  coupons: string[]

  @ManyToOne(() => Event)
  event: Event

  @ManyToMany(() => User)
  users: []
}
