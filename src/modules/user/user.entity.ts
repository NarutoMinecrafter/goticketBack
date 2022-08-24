import { BankAccount } from './../bank/bank.entity'
import { BadRequestException } from '@nestjs/common'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SexEnum } from './user.dto'
import { ApiProperty } from '@nestjs/swagger'
import { getFormattedAddress } from '../../utils/geolocation.utils'
import { Guest } from '../guest/guest.entity'
import { Event } from '../event/event.entity'
import { Location } from '../../types/location.types'
import { Payment } from '../payment/payment.entity'
import { Editor } from '../editor/editor.entity'

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
  @Column({ unique: true, nullable: true })
  email?: string

  @ApiProperty({ description: 'User birthdate', example: '25.01.1978' })
  @Column('timestamptz', { nullable: true })
  birthdate?: Date

  @ApiProperty({ description: 'User ID Code', example: '228' })
  @Column({ unique: true, nullable: true })
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

  @ApiProperty({ description: 'User sex', example: SexEnum.Women })
  @Column({ enum: SexEnum, default: SexEnum.Uknown })
  sex: SexEnum

  @ApiProperty({ description: 'User avatar link', example: 'https://cutt.ly/aLyxInS' })
  @Column({ nullable: true })
  avatar?: string

  @ApiProperty({ description: 'Push notification token', example: 'YOUR NOTIFICATION TOKEN' })
  @Column({ nullable: true })
  pushNotificationToken?: string

  @ApiProperty({ description: 'User payments', type: () => [Payment], default: [] })
  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[]

  @ApiProperty({ description: 'User bank accounts', type: () => [BankAccount], default: [] })
  @OneToMany(() => BankAccount, bank => bank.user)
  bankAccounts: BankAccount[]

  @ApiProperty({ description: 'User events', type: () => [Event], default: [] })
  @OneToMany(() => Event, event => event.creator)
  events?: Event[]

  @ApiProperty({ description: 'User guests', example: () => [Guest], type: () => [Guest], default: [] })
  @OneToMany(() => Guest, guest => guest.event)
  guests?: Guest[]

  @ApiProperty({ description: 'User as editor', example: () => [Editor], type: () => [Editor], default: [] })
  @OneToMany(() => Editor, editor => editor.user)
  editors?: Editor[]

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
