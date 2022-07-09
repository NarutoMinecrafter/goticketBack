import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
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
  @IsNumber()
  readonly preOrderPrice: number

  @ApiProperty({ example: 5000, description: 'Ticket last-chance price', required: false })
  @IsNumber()
  readonly lastChancePrice: number

  @ApiProperty({ example: 500, description: 'Quantity of tickets' })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  readonly totalCount!: number
}

export class BuyTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @ApiProperty({ example: 1, description: 'Quantity of tickets' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly count: number

  readonly user: User

  readonly event: Event
}

export class GetTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id', required: false })
  readonly id: number

  @ApiProperty({ example: 123, description: 'Event id' })
  readonly eventId: number
}
