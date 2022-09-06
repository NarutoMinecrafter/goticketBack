import { ToBolean } from '../../decorators/ToBolean'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Event } from '../event/event.entity'
import { User } from '../user/user.entity'
import { ToNumber } from '../../decorators/ToNumber'

export class CreateTicketDto {
  @ApiProperty({ example: 'VIP', description: 'Type of tickets' })
  @IsString()
  @IsNotEmpty()
  readonly type: string

  @ApiProperty({ example: 'Natura 2021 VIP', description: 'Name of type' })
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({ example: 3500, description: 'Regular price' })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  readonly regularPrice: number

  @ApiProperty({ example: 250, description: 'Early bird price', required: false })
  @ToNumber()
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly earlyBirdPrice: number

  @ApiProperty({ example: 5000, description: 'Last chance price', required: false })
  @ToNumber()
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly lastChancePrice: number

  @ApiProperty({ example: 3500, description: 'Regular tickets count' })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  readonly regularCount: number

  @ApiProperty({ example: 250, description: 'Early bird tickets count', required: false })
  @ToNumber()
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly earlyBirdCount: number

  @ApiProperty({ example: 5000, description: 'Last chance tickets count', required: false })
  @ToNumber()
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly lastChanceCount: number

  @ApiProperty({ example: true, description: 'Can be booked', required: false })
  @ToBolean()
  @IsBoolean()
  @IsOptional()
  readonly canBeBooked?: boolean
}

export class BuyTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @ApiProperty({ example: 1, description: 'Quantity of tickets' })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  readonly count: number

  @ApiProperty({
    example: true,
    description: 'If true, then the ticket will be booked, not purchased',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  readonly isBooking?: boolean

  readonly user: User

  readonly event: Event
}

export class GetByTicketIdDto {
  @ApiProperty({ example: 1, description: 'Ticket id', required: true })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}

export class GetTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id', required: false })
  @ToNumber()
  @IsNumber()
  @IsOptional()
  readonly id?: number
}
