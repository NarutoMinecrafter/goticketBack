import { BadRequestException } from '@nestjs/common'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SexEnum } from './user.dto'
import { ApiProperty } from '@nestjs/swagger'
import { getFormattedAddress } from '../../utils/geolocation.utils'
import { Guest } from '../guest/guest.entity'
import { Event } from '../event/event.entity'
import { CardNumberType, TokenType } from '../../types/payment.types'
import { Location } from '../../types/location.types'

class Payment {
  @ApiProperty({ description: 'User paymentToken', example: '' })
  @Column({ nullable: true })
  paymentToken?: TokenType

  @ApiProperty({ description: 'User payment CVV code', example: '123' })
  @Column({ nullable: true })
  paymentCVV?: string

  @ApiProperty({ description: 'User payment CVV code', example: 'Kiril Baranov' })
  @Column({ nullable: true })
  paymentCardHolder: string

  @ApiProperty({ description: 'User formatted card', example: '44** **** **** 9000' })
  @Column({ nullable: true })
  formattedCardNumber: CardNumberType

  @Column({ nullable: false, default: true })
  isSelected?: boolean
}

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

  @ApiProperty({ description: 'About user', example: 'I YouTube' })
  @Column({ nullable: true })
  aboutMe?: string

  @ApiProperty({ description: 'User sex', example: SexEnum.Woman })
  @Column({ enum: SexEnum })
  sex?: SexEnum

  @ApiProperty({ description: 'User paymentToken', example: '' })
  @Column({ type: 'json', default: [] })
  payments?: Payment[]

  @ApiProperty({ description: 'User avatar link', example: 'https://cutt.ly/aLyxInS' })
  @Column({ nullable: true })
  avatar?: string

  @ApiProperty({ description: 'Push notification token', example: 'YOUR NOTIFICATION TOKEN' })
  @Column({ nullable: true })
  pushNotificationToken?: string

  @ApiProperty({ description: 'User events', type: () => [Event], default: [] })
  @OneToMany(() => Event, event => event.creator)
  events?: Event[]

  @ApiProperty({ description: 'User guests', example: () => [Guest], type: () => [Guest], default: [] })
  @OneToMany(() => Guest, guest => guest.event)
  guests?: Guest[]

  @BeforeInsert()
  @BeforeUpdate()
  async formateAddress() {
    if (this.location) {
      const address = await getFormattedAddress(this.location)

      if (!address) {
        throw new BadRequestException('Invalid location')
      }

      this.address = address
    }
  }
}
