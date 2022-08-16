import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../user/user.entity'
import { Ticket } from '../ticket/ticket.entity'
import { Guest } from '../guest/guest.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'
import { getFormattedAddress } from '../../utils/geolocation.utils'
import { BadRequestException } from '@nestjs/common'
import { Location } from '../../types/location.types'
import { ToBolean } from '../../decorators/ToBolean'
import { ToNumber } from '../../decorators/ToNumber'
import { Editor } from '../editor/editor.entity'

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

export class RequiredAdditionalInfoDto {
  @ApiProperty({ description: 'Does a person have to indicate age to buy this ticket', example: true, default: false })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isAgeRequired = false

  @ApiProperty({ description: 'Minimum user age to purchase tickets', example: 18, default: 0 })
  @ToNumber()
  @Min(0)
  @IsNumber()
  @IsOptional()
  minRequiredAge = 0

  @ApiProperty({ description: 'Does a person have to indicate sex to buy this ticket', example: false, default: false })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isSexRequired = false

  @ApiProperty({
    description: 'Does a person have to indicate ID-Code to buy this ticket',
    example: false,
    default: false
  })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isIDCodeRequired = false

  @ApiProperty({
    description: 'Does a person have to indicate instagram link to buy this ticket',
    example: false,
    default: false
  })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isInstagramRequired = false
}

export const defaultRequiredAdditionalInfo = new RequiredAdditionalInfoDto()

@Entity()
export class Event {
  @ApiProperty({ description: 'Event id', example: 24081991 })
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty({ description: 'Event name', example: 'Independence Day of Ukraine' })
  @Column('text', { nullable: false })
  name!: string

  @ApiProperty({ description: 'Start date of this event', example: '24.08.2022' })
  @Column('timestamptz', { nullable: false })
  startDate!: Date

  @ApiProperty({ description: 'End date of this event', example: '25.08.2022' })
  @Column('timestamptz')
  endDate: Date

  @ApiProperty({ description: 'Creation date of this event', example: '06.07.2022' })
  @CreateDateColumn()
  createDate: Date

  @ApiProperty({ description: 'Short event description', example: 'This is the main state holiday in modern Ukraine' })
  @Column('text', { nullable: false })
  shortDescription!: string

  @ApiProperty({
    description: 'Full event description',
    example:
      'Independence Day of Ukraine is the main state holiday in modern Ukraine, celebrated on 24 August in commemoration of the Declaration of Independence of 1991'
  })
  @Column('text')
  fullDescription: string

  @ApiProperty({
    description: 'Links to a demo or description of this event',
    example: ['https://www.youtube.com/watch?v=d1YBv2mWll0']
  })
  @Column('text', { array: true, default: [] })
  demoLinks!: string[]

  @ApiProperty({ description: 'Event type', isArray: true, example: [TypeEnum.Festival], enum: TypeEnum })
  @Column('text', { array: true, nullable: false, default: [] })
  type: TypeEnum[]

  @ApiProperty({ description: 'Event location', example: () => Location, type: () => Location })
  @Column('json', { nullable: false })
  location!: Location

  @ApiProperty({ description: 'String address', example: 'Kyiv' })
  @Column('text', { nullable: true })
  address: string

  @ApiProperty({ description: 'Bank Id', example: '5555' })
  @Column('text', { nullable: false, array: true })
  bank!: string[]

  @ApiProperty({ description: 'Is private event', example: false })
  @Column('bool', { default: false })
  isPrivate: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false })
  @Column('bool', { default: false })
  isHidden: boolean

  @ApiProperty({
    description: 'Is some additional info required',
    example: () => RequiredAdditionalInfoDto,
    type: () => RequiredAdditionalInfoDto
  })
  @Column('json', { default: defaultRequiredAdditionalInfo })
  requiredAdditionalInfo: RequiredAdditionalInfoDto

  @ApiProperty({ description: "Ticket's of this event", example: () => [Ticket], type: () => [Ticket] })
  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[]

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @Column('text', { array: true, default: [] })
  coupons: string[]

  @ApiProperty({ description: 'Creator of this event', example: () => User, type: () => User })
  @ManyToOne(() => User, user => user.events)
  creator: User

  @ApiProperty({ description: 'Editors (managers) of this event', example: () => [Editor], type: () => [Editor] })
  @OneToMany(() => Editor, editor => editor.event)
  editors: Editor[]

  @ApiProperty({ description: "Guest's of this event", example: () => [Guest], type: () => [Guest] })
  @OneToMany(() => Guest, guest => guest.event)
  @JoinColumn()
  guests: Guest[]

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
