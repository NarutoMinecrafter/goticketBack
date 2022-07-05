import { ApiProperty } from '@nestjs/swagger'
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { CreateTicketDto } from '../ticket/ticket.dto'

export enum SortTypes {
  ByDate = 'date',
  ByTicketsCount = 'tickets',
  ByGeolocation = 'geo',
  ByCreateDate = 'createDate'
}

export interface Location {
  lat: number
  lon: number
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

  @ApiProperty({ example: 'Very cool anime festival', description: 'Full description' })
  @IsString()
  readonly fullDescription: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date' })
  @IsDateString()
  readonly startDate!: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date' })
  @IsDateString()
  readonly endDate: string

  @ApiProperty({ example: ['https://youtu.be/dQw4w9WgXcQ'], description: 'Demo videos or pictures' })
  @IsArray()
  @ArrayMaxSize(3)
  readonly demo: string[]

  @ApiProperty({ example: '5555', description: 'Bank account' })
  @IsString()
  @IsNotEmpty()
  readonly bank!: string

  @ApiProperty({ example: '302 8TH NEW YORK NY 10001-4813 USA', description: 'Pretty variant of address' })
  @IsString()
  @IsNotEmpty()
  readonly address!: string

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'Event latitude/longitude location',
    required: true
  })
  readonly location?: Location

  @ApiProperty({ type: [CreateTicketDto], description: 'Array of tickets' })
  readonly tickets: CreateTicketDto[]
}

export class GetEventDto {
  @ApiProperty({ example: '42', description: 'Event id', required: false })
  @IsString()
  readonly id?: string

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
