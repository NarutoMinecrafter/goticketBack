import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTicketDto {
  @ApiProperty({ example: 'VIP', description: 'Type of tickets' })
  @IsString()
  @IsNotEmpty()
  readonly type!: string

  @ApiProperty({ example: 'Natura 2021 VIP', description: 'Name of type' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty({ example: 3500, description: 'Regular price' })
  @IsNumber()
  @IsNotEmpty()
  readonly price!: number

  @ApiProperty({ example: 250, description: 'Min price' })
  @IsNumber()
  readonly minPrice: number

  @ApiProperty({ example: 5000, description: 'Max price' })
  @IsNumber()
  readonly maxPrice: number

  @ApiProperty({ example: 500, description: 'Quantity of tickets' })
  @IsNumber()
  readonly totalCount!: number
}
