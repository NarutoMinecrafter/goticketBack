import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min } from 'class-validator'
import { Event } from '../event/event.entity'
import { User } from '../user/user.entity'

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
  @IsNumber()
  @IsNotEmpty()
  readonly price: number

  @ApiProperty({ example: 250, description: 'Ticket pre-order price', required: false })
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly preOrderPrice: number

  @ApiProperty({ example: 5000, description: 'Ticket last-chance price', required: false })
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly lastChancePrice: number

  @ApiProperty({ example: 500, description: 'Quantity of tickets' })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  readonly totalCount: number

  @ApiProperty({ example: true, description: 'Can be booked', required: false })
  @IsBoolean()
  @IsOptional()
  readonly canBeBooked?: boolean
}

export class BuyTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id' })
  @IsNumberString()
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
  @IsNumberString()
  @IsNotEmpty()
  readonly id: string
}

export class GetTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id', required: false })
  @IsNumberString()
  @IsOptional()
  readonly id?: string
}