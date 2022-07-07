import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Ticket } from '../ticket/ticket.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

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

export class Location {
  @ApiProperty({ description: 'Latitude', example: 35.7040744 })
  lat: number

  @ApiProperty({ description: 'Longitude', example: 139.5577317 })
  lon: number
}

@Entity()
export class Event {
  @ApiProperty({ description: 'Event id', example: 24081991 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'Event name', example: 'Independence Day of Ukraine' })
  @Column({ nullable: false })
  name!: string

  @ApiProperty({
    description: 'Links to a demo or description of this event',
    example: ['https://www.youtube.com/watch?v=d1YBv2mWll0']
  })
  @Column('text', { array: true, default: [] })
  demoLinks!: string[]

  @ApiProperty({ description: 'Start date of this event', example: '24.08.2022' })
  @Column('date', { nullable: false })
  startDate!: Date

  @ApiProperty({ description: 'End date of this event', example: '25.08.2022' })
  @Column('date')
  endDate: Date

  @ApiProperty({ description: 'Creation date of this event', example: '06.07.2022' })
  @CreateDateColumn()
  createDate: Date

  @ApiProperty({ description: 'Short event description', example: 'This is the main state holiday in modern Ukraine' })
  @Column({ nullable: false })
  shortDescription!: string

  @ApiProperty({
    description: 'Full event description',
    example:
      'Independence Day of Ukraine is the main state holiday in modern Ukraine, celebrated on 24 August in commemoration of the Declaration of Independence of 1991'
  })
  @Column()
  fullDescription: string

  @ApiProperty({ description: 'Event type', example: TypeEnum.Festival, enum: TypeEnum })
  @Column({ enum: TypeEnum })
  type: TypeEnum

  @ApiProperty({ description: 'Event location', example: () => Location, type: () => Location })
  @Column('json', { nullable: false })
  location!: Location

  @ApiProperty({ description: 'Bank Id', example: '5555' })
  @Column({ nullable: false })
  bank!: string

  @ApiProperty({ description: 'Is private event', example: false })
  @Column('bool', { default: false })
  isPrivate: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false })
  @Column('bool', { default: false })
  isHidden: boolean

  @ApiProperty({ description: "Ticket's of this event", example: () => [Ticket], type: () => [Ticket] })
  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[]

  @ApiProperty({ description: 'Creator of this event', example: () => User, type: () => User })
  @ManyToOne(() => User, user => user.events)
  creator: User

  @ApiProperty({ description: 'Users of this event', example: () => [User], type: () => [User] })
  @ManyToMany(() => User)
  members: User[]

  @ApiProperty({ description: "Guest's of this event", example: () => [Guest], type: () => [Guest] })
  @OneToMany(() => Guest, guest => guest.event)
  guests: Guest[]
}
