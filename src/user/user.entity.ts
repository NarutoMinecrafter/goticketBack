import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Event, Location } from '../event/event.entity'
import { SexEnum } from './user.dto'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class User {
  @ApiProperty({ description: 'User id', example: '1337' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'User name', example: 'Kirill' })
  @Column({ nullable: false })
  name: string

  @ApiProperty({ description: 'User surname', example: 'Baranov' })
  @Column({ nullable: false })
  surname: string

  @ApiProperty({ description: 'User phone', example: '+380984556565' })
  @Column({ unique: true, nullable: false })
  phone!: string

  @ApiProperty({ description: 'User email', example: 'J3BA1T3D' })
  @Column({ unique: true })
  email?: string

  @ApiProperty({ description: 'User birthdate', example: '25.01.1978' })
  @Column('timestamptz', { nullable: true })
  birthdate?: Date

  @ApiProperty({ description: 'User ID Code', example: '228' })
  @Column({ unique: true })
  IDcode?: string

  @ApiProperty({ description: 'String address', example: 'Kiyiv' })
  @Column('text', { nullable: true })
  address?: string

  @ApiProperty({ description: 'User lat-lon location', example: () => Location, type: () => Location })
  @Column('json', { nullable: true })
  location?: Location

  @ApiProperty({ description: 'User instagram link', example: 'https://www.instagram.com/zelenskiy_official/' })
  @Column({ unique: true, nullable: true })
  instagram?: string

  @ApiProperty({ description: 'User sex', example: SexEnum.Woman })
  @Column({ enum: SexEnum })
  sex?: SexEnum

  @ApiProperty({ description: 'User avatar link', example: 'https://cutt.ly/aLyxInS' })
  @Column({ nullable: true })
  avatar?: string

  @ApiProperty({ description: 'User events', type: () => [Event], default: [] })
  @OneToMany(() => Event, event => event.creator)
  events?: Event[]

  @ApiProperty({ description: 'User guests', example: () => [Guest], type: () => [Guest], default: [] })
  @OneToMany(() => Guest, guest => guest.event)
  guests?: Guest[]
}
