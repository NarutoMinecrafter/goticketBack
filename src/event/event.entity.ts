import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Ticket } from '../ticket/ticket.entity'
import { Guest } from '../guest/guest.entity'

export enum TypeEnum {
  Music = 'Music',
  Concert = 'Concert',
  Dance = 'Dance',
  Education = 'Education',
  Conference = 'Conference',
  Workshop = 'Workshop',
  Festival = 'Festival',
  DJSet = 'DJ-set',
  Art = 'Art',
  Theater = 'Theater',
  Cinema = 'Cinema',
  Exhibition = 'Exhibition'
}

export interface ILocation {
  lat: number
  lon: number
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  name!: string

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

  @Column({ enum: TypeEnum })
  type: TypeEnum

  @Column('json', { nullable: false })
  location!: ILocation

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

  @ManyToMany(() => Guest)
  guests: Guest[]
}
