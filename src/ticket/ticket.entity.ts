import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from './../event/event.entity'
import { Guest } from './../guest/guest.entity'

export const defaultRequiredAdditionalInfo = {
  age: false,
  minAge: false as false | number,
  sex: false,
  IDcode: false,
  instagram: false
}

export type RequiredAdditionalInfo = Partial<typeof defaultRequiredAdditionalInfo>

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

  @Column('json', { default: defaultRequiredAdditionalInfo })
  requiredAdditionalInfo: RequiredAdditionalInfo

  @Column('bool', { default: false })
  paid: boolean

  @Column('text', { array: true, default: [] })
  coupons: string[]

  @ManyToOne(() => Event)
  event: Event

  @OneToMany(() => Guest, guest => guest.ticket)
  guests: Guest[]
}
