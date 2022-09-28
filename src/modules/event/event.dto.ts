import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsLatLong,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { ToBolean } from '../../decorators/ToBolean'
import { ToDate } from '../../decorators/ToDate'
import { ToNumber } from '../../decorators/ToNumber'
import { Location, StringLocation } from '../../types/location.types'
import { BuyTicketDto, CreateTicketDto } from '../ticket/ticket.dto'
import { RequiredAdditionalInfoDto, TypeEnum } from './event.entity'
import { EditorDto } from '../editor/editor.dto'

export enum SortTypes {
  ByDate = 'date',
  ByTicketsCount = 'tickets',
  ByGeolocation = 'geo',
  ByCreateDate = 'createDate'
}

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
  readonly fullDescription?: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date' })
  @ToDate()
  @IsDate()
  @IsNotEmpty()
  readonly startDate!: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date' })
  @ToDate()
  @IsDate()
  @IsNotEmpty()
  readonly endDate!: string

  @ApiProperty({ example: [], description: 'Demo videos or pictures', required: false })
  @IsArray()
  @ArrayMaxSize(3)
  @IsOptional()
  readonly files?: Express.Multer.File[]

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  @ArrayMinSize(0)
  @IsOptional()
  readonly demoLinks?: string[]

  @ApiProperty({ example: [TypeEnum.Festival], isArray: true, description: 'Event type array', enum: TypeEnum })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(TypeEnum, { each: true })
  type!: TypeEnum[]

  @ApiProperty({ example: ['111'], description: 'Bank accounts' })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  readonly bank: string[]

  @ApiProperty({ description: 'Is private event', example: false, required: false })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean

  @ApiProperty({ description: 'Whether the event is hidden', example: false, required: false })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean

  @ApiProperty({
    example: () => RequiredAdditionalInfoDto,
    description: 'Required additional info for organizers',
    type: () => RequiredAdditionalInfoDto,
    required: false
  })
  @IsObject()
  @ValidateNested()
  @Type(() => RequiredAdditionalInfoDto)
  @IsOptional()
  readonly requiredAdditionalInfo?: RequiredAdditionalInfoDto

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'Event latitude/longitude location'
  })
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Location)
  readonly location!: Location

  @ApiProperty({ type: [CreateTicketDto], description: 'Array of tickets' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketDto)
  readonly tickets!: CreateTicketDto[]

  @ApiProperty({ description: 'Discount coupons', example: ['ZPFK'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly coupons?: string[]

  @ApiProperty({ description: 'Event editors (managers)', example: [EditorDto], required: false })
  @IsArray()
  @IsOptional()
  readonly editors?: EditorDto[]
}

export class GetEventDto {
  @ApiProperty({ example: 42, description: 'Event id', required: false })
  @ToNumber()
  @IsNumber()
  @IsOptional()
  readonly id?: number

  @ApiProperty({ example: 'Minecone', description: 'Search by query', required: false })
  @IsOptional()
  @IsString()
  readonly query?: string

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
    description: `Filter by date from this`,
    required: false
  })
  @ToDate()
  @IsDate()
  @IsOptional()
  readonly dateFrom?: string

  @ApiProperty({
    example: '2022-02-24T02:00:00.777Z',
    description: `Filter by date to this`,
    required: false
  })
  @ToDate()
  @IsDate()
  @IsOptional()
  readonly dateTo?: string

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
  @ToNumber()
  @IsNumber()
  @IsOptional()
  readonly placeNearInMeters?: number

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
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  readonly onlyInStock?: string

  @ApiProperty({
    example: '18-35',
    description: `Filter by age`,
    required: false
  })
  @IsString()
  @IsOptional()
  readonly age?: string
}

export class GetByEventIdDto {
  @ApiProperty({ example: '1', description: 'Event id' })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}

export class BuyTicketsDto {
  @ApiProperty({ example: 1, description: 'Event id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @ApiProperty({ type: [BuyTicketDto], description: 'Array of tickets' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BuyTicketDto)
  readonly tickets!: BuyTicketDto[]
}

export class ChangeEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ example: 23, description: 'Event id' })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}

export class GetPopularLocation {
  @ApiProperty({ example: 10, description: 'Limit. Default: 5' })
  @IsNumber()
  @IsOptional()
  readonly limit: number
}

export class UseTicketDto {
  @ApiProperty({ example: 1, description: 'Guest id' })
  @IsNumber()
  @IsNotEmpty()
  readonly guestId: number

  @ApiProperty({
    example: false,
    description: 'If true and the ticket is booked, then the money will be deducted from the card'
  })
  @IsBoolean()
  @IsOptional()
  readonly payByCard?: boolean
}
