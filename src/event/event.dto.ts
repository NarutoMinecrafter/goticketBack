import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsEnum,
  IsLatLong,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator'
import { BuyTicketDto, CreateTicketDto } from '../ticket/ticket.dto'
import { Location, RequiredAdditionalInfoDto, TypeEnum } from './event.entity'

export enum SortTypes {
  ByDate = 'date',
  ByTicketsCount = 'tickets',
  ByGeolocation = 'geo',
  ByCreateDate = 'createDate'
}

export type StringLocation = `${Location['lat']}, ${Location['lon']}`

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
  @IsOptional()
  readonly fullDescription: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date' })
  @IsDateString()
  @IsNotEmpty()
  readonly startDate!: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date' })
  @IsDateString()
  @IsNotEmpty()
  readonly endDate!: string

  @ApiProperty({ example: ['https://youtu.be/dQw4w9WgXcQ'], description: 'Demo videos or pictures', required: false })
  @IsArray()
  @ArrayMaxSize(3)
  readonly demoLinks: string[]

  @ApiProperty({ example: [TypeEnum.Festival], isArray: true, description: 'Event type array', enum: TypeEnum })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  type: TypeEnum[]

  @ApiProperty({ example: '5555', description: 'Bank account' })
  @IsString()
  @IsNotEmpty()
  readonly bank: string

  @ApiProperty({
    example: '302 8TH NEW YORK NY 10001-4813 USA',
    description: 'Pretty variant of address'
  })
  @IsString()
  @IsNotEmpty()
  readonly address: string

  @ApiProperty({ description: 'Is private event', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isPrivate: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false, required: false })
  @IsBoolean()
  @IsOptional()
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
    description: 'Event latitude/longitude location'
  })
  @IsObject()
  @IsNotEmptyObject()
  readonly location: Location

  @ApiProperty({ type: [CreateTicketDto], description: 'Array of tickets' })
  @IsArray()
  @IsNotEmpty()
  readonly tickets: CreateTicketDto[]

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @IsArray()
  @IsOptional()
  readonly coupons?: string[]

  @ApiProperty({ description: 'Array of editors user id', example: [123, 32], required: false })
  @IsArray()
  @IsOptional()
  readonly editors?: number[]
}

export class GetEventDto {
  @ApiProperty({ example: '42', description: 'Event id', required: false })
  @IsOptional()
  @IsNumberString()
  readonly id?: string

  @ApiProperty({ example: SortTypes.ByDate, description: 'Sort events by value', required: false, enum: SortTypes })
  @IsOptional()
  @IsEnum(SortTypes)
  readonly sortBy?: SortTypes

  @ApiProperty({
    example: '52.129101, 45.857929',
    description: `User latitude/longitude location. Need for Sorting by Geolocation`,
    required: false
  })
  @IsOptional()
  @IsLatLong()
  readonly userLocation?: StringLocation

  @ApiProperty({
    example: '2022-02-24T02:00:00.777Z',
    description: `Filter by date`,
    required: false
  })
  @IsDateString()
  @IsOptional()
  readonly date?: string

  @ApiProperty({
    example: 'false',
    description: `Specify whether to sort exactly by the specified date or until the specified date`,
    required: false
  })
  @IsBooleanString()
  @IsOptional()
  readonly isUntilDate?: string

  @ApiProperty({
    example: 'start,creation',
    description: `Types of date(creation or/and start), separated by comma`,
    required: false
  })
  @IsString()
  @IsOptional()
  readonly dateType?: string

  @ApiProperty({
    example: 100,
    description: `Filter by place`,
    required: false
  })
  @IsNumberString()
  @IsOptional()
  readonly placeNearInMeters?: string

  @ApiProperty({
    example: 'Music,Concert',
    description: `Filter by type. Type must be comma separated`,
    required: false
  })
  @IsString()
  @IsOptional()
  readonly eventType?: string

  @ApiProperty({
    example: 'false',
    description: `Filter by only in stock tickets`,
    required: false
  })
  @IsBooleanString()
  @IsOptional()
  readonly onlyInStock?: string
}

export class GetByEventIdDto {
  @ApiProperty({ example: '1', description: 'Event id' })
  @IsNumberString()
  @IsNotEmpty()
  readonly id: string
}

export class BuyTicketsDto {
  @ApiProperty({ example: 1, description: 'Event id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @ApiProperty({ type: [BuyTicketDto], description: 'Array of tickets' })
  @IsArray()
  @ArrayNotEmpty()
  readonly tickets!: BuyTicketDto[]
}

export class ChangeEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ example: 23, description: 'Event id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}

export class GetPopularLocation {
  @ApiProperty({ example: 10, description: "Limit. Default: 5" })
  @IsNumber()
  @IsOptional()
  readonly limit: number;
}
