import { ApiProperty } from '@nestjs/swagger'
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator'
import { BuyTicketDto, CreateTicketDto } from '../ticket/ticket.dto'
import { Location, RequiredAdditionalInfoDto, TypeEnum } from './event.entity'

export enum SortTypes {
  ByDate = 'date',
  ByTicketsCount = 'tickets',
  ByGeolocation = 'geo',
  ByCreateDate = 'createDate'
}

export type StringLocation = `${Location['lat']}-${Location['lon']}`

export class CreateEventDto {
  @ApiProperty({ example: 'Comic con', description: 'Title' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty({ example: 'Anime fest', description: 'Short description' })
  @IsString()
  @IsNotEmpty()
  readonly shortDescription!: string

  @ApiProperty({ example: 'Very cool anime festival', description: 'Full description', required: false })
  @IsString()
  readonly fullDescription: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date' })
  @IsDateString()
  readonly startDate!: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date' })
  @IsDateString()
  readonly endDate!: string

  @ApiProperty({ example: ['https://youtu.be/dQw4w9WgXcQ'], description: 'Demo videos or pictures', required: false })
  @IsArray()
  @ArrayMaxSize(3)
  readonly demoLinks: string[]

  @ApiProperty({ example: TypeEnum.Festival, description: 'Event type', enum: TypeEnum })
  @IsEnum(TypeEnum)
  type: TypeEnum

  @ApiProperty({ example: '5555', description: 'Bank account' })
  @IsString()
  @IsNotEmpty()
  readonly bank!: string

  @ApiProperty({
    example: '302 8TH NEW YORK NY 10001-4813 USA',
    description: 'Pretty variant of address',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  readonly address!: string

  @ApiProperty({ description: 'Is private event', example: false, required: false })
  isPrivate: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false, required: false })
  isHidden: boolean

  @ApiProperty({
    example: () => RequiredAdditionalInfoDto,
    description: 'Required additional info for organizers',
    type: () => RequiredAdditionalInfoDto,
    required: false
  })
  @IsObject()
  readonly requiredAdditionalInfo?: RequiredAdditionalInfoDto

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'Event latitude/longitude location',
    required: true
  })
  @IsObject()
  readonly location: Location

  @ApiProperty({ type: [CreateTicketDto], description: 'Array of tickets' })
  @IsArray()
  @IsNotEmpty()
  readonly tickets!: CreateTicketDto[]

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @IsArray()
  @IsString()
  readonly coupons: string[]

  @ApiProperty({ description: 'Array of editors user id', example: [123, 32], required: false })
  @IsArray()
  @IsNumber()
  readonly editors: number[]
}

export class GetEventDto {
  @ApiProperty({ example: '42', description: 'Event id', required: false })
  @IsString()
  readonly id?: number

  @ApiProperty({ example: SortTypes.ByDate, description: 'Sort events by value', required: false, enum: SortTypes })
  @IsEnum(SortTypes)
  readonly sortBy?: SortTypes

  @ApiProperty({
    example: '52.129101-45.857929',
    description: `User latitude/longitude location. Need for Sorting by Geolocation`,
    required: false
  })
  @IsString()
  readonly userLocation?: StringLocation
}

export class GetEventByUserId {
  @ApiProperty({ example: '69', description: 'User id', required: false })
  @IsString()
  readonly id?: string
}

export class BuyTicketsDto {
  @ApiProperty({ example: 1, description: 'Event id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id!: number

  @ApiProperty({ type: [BuyTicketDto], description: 'Array of tickets' })
  @IsArray()
  @IsNotEmpty()
  readonly tickets!: BuyTicketDto[]
}

export class ChangeEventDto {
  @ApiProperty({ example: 23, description: 'Event id', required: true })
  @IsNumber()
  readonly id: number

  @ApiProperty({ example: 'Comic con', description: 'Title', required: false })
  @IsString()
  @IsNotEmpty()
  readonly name?: string

  @ApiProperty({ example: 'Anime fest', description: 'Short description', required: false })
  @IsString()
  @IsNotEmpty()
  readonly shortDescription?: string

  @ApiProperty({ example: 'Very cool anime festival', description: 'Full description', required: false })
  @IsString()
  readonly fullDescription?: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date', required: false })
  @IsDateString()
  readonly startDate?: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date', required: false })
  @IsDateString()
  readonly endDate?: string

  @ApiProperty({ example: ['https://youtu.be/dQw4w9WgXcQ'], description: 'Demo videos or pictures', required: false })
  @IsArray()
  @ArrayMaxSize(3)
  readonly demoLinks?: string[]

  @ApiProperty({ example: TypeEnum.Festival, description: 'Event type', enum: TypeEnum, required: false })
  @IsEnum(TypeEnum)
  readonly type?: TypeEnum

  @ApiProperty({ example: '5555', description: 'Bank account', required: false })
  @IsString()
  @IsNotEmpty()
  readonly bank?: string

  @ApiProperty({
    example: '302 8TH NEW YORK NY 10001-4813 USA',
    description: 'Pretty variant of address',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  readonly address?: string

  @ApiProperty({ description: 'Is private event', example: false, required: false })
  readonly isPrivate?: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false, required: false })
  readonly isHidden?: boolean

  @ApiProperty({
    example: () => RequiredAdditionalInfoDto,
    description: 'Required additional info for organizers',
    type: () => RequiredAdditionalInfoDto,
    required: false
  })
  @IsObject()
  readonly requiredAdditionalInfo?: RequiredAdditionalInfoDto

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'Event latitude/longitude location',
    required: false
  })
  @IsObject()
  readonly location?: Location

  @ApiProperty({ type: [CreateTicketDto], description: 'Array of tickets', required: false })
  @IsArray()
  @IsNotEmpty()
  readonly tickets?: CreateTicketDto[]

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'], required: false })
  @IsArray()
  @IsString()
  readonly coupons?: string[]

  @ApiProperty({ description: 'Array of editors user id', example: [123, 32], required: false })
  @IsArray()
  @IsNumber()
  readonly editors: number[]
}
