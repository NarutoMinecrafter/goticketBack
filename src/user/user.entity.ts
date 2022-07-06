import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event } from '../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { SexEnum } from './user.dto'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class User {
  @ApiProperty({ description: 'User id', example: '1337' })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'User name', example: 'Kirill' })
  @Column({ nullable: false })
  name!: string

  @ApiProperty({ description: 'User surname', example: 'Baranov' })
  @Column({ nullable: false })
  surname!: string

  @ApiProperty({ description: 'User phone', example: '+380984556565' })
  @Column({ unique: true, nullable: false })
  phone!: string

  @ApiProperty({ description: 'User email', example: 'J3BA1T3D' })
  @Column({ unique: true })
  email: string

  @ApiProperty({ description: 'User birthdate', example: '25.01.1978' })
  @Column('date', { nullable: true })
  birthdate: Date

  @ApiProperty({ description: 'User ID Code', example: '228' })
  @Column({ unique: true })
  IDcode: string

  @ApiProperty({ description: 'User instagram link', example: 'https://www.instagram.com/zelenskiy_official/' })
  @Column({ unique: true, nullable: true })
  instagram?: string

  @ApiProperty({ description: 'User sex', example: SexEnum.Other })
  @Column({ enum: SexEnum })
  sex?: SexEnum

  @ApiProperty({ description: 'User avatar link', example: 'https://cutt.ly/aLyxInS' })
  @Column({ nullable: true })
  avatar?: string

  @ApiProperty({ description: 'User tickets', type: () => [Ticket] })
  @OneToMany(() => Guest, guest => guest.user)
  tickets: Ticket[]

  @ApiProperty({ description: 'User events', type: () => [Event] })
  @OneToMany(() => Event, event => event.creator)
  events: Event[]
}
