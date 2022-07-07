import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
import { AdditionalInfoDto } from '../guest/guest.dto'
import { User } from '../user/user.entity'
import { Event } from '../event/event.entity'

export class RequiredAdditionalInfoDto {
  @ApiProperty({ description: 'Does a person have to indicate age to buy this ticket', example: true })
  @IsBoolean()
  isAgeRequired = false

  @ApiProperty({ description: 'Minimum user age to purchase tickets', example: 18 })
  @Min(0)
  @IsNumber()
  minRequiredAge = 0

  @ApiProperty({ description: 'Does a person have to indicate sex to buy this ticket', example: false })
  @IsBoolean()
  isSexRequired = false

  @ApiProperty({ description: 'Does a person have to indicate ID-Code to buy this ticket', example: false })
  @IsBoolean()
  isIDCodeRequired = false

  @ApiProperty({ description: 'Does a person have to indicate instagram link to buy this ticket', example: false })
  @IsBoolean()
  isInstagramRequired = false
}

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
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  readonly totalCount!: number

  @ApiProperty({
    example: () => RequiredAdditionalInfoDto,
    description: 'Required additional info for organizers',
    type: () => RequiredAdditionalInfoDto
  })
  additionalInfo?: RequiredAdditionalInfoDto
}

export class BuyTicketDto {
  @ApiProperty({ example: 1, description: 'Ticket id' })
  @IsNumber()
  @IsNotEmpty()
  readonly id!: number

  @ApiProperty({ example: 1, description: 'Quantity of tickets' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly count!: number

  @ApiProperty({ example: 'NARUTO20', description: 'Promocode' })
  @IsString()
  readonly cupon: string

  @ApiProperty({ type: AdditionalInfoDto, description: 'Additional info for organizers', required: true })
  @IsNotEmpty()
  readonly additionalInfo!: AdditionalInfoDto

  @IsNotEmpty()
  user: User

  @IsNotEmpty()
  event: Event
}

export class GetTicketDto {
  @ApiProperty({ example: '1', description: 'Ticket id', required: false })
  readonly id?: string
}
