import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { Event } from '../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { SexEnum } from '../user/user.dto'
import { User } from '../user/user.entity'

export class AdditionalInfoDto {
  @ApiProperty({ example: 'Naruto Minecrafter', description: 'Guest name' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty({ example: '+88005553535', description: 'Guest name' })
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone!: number

  @ApiProperty({ example: 19, description: 'Guest age' })
  @IsNumber()
  @IsOptional()
  readonly age?: number

  @ApiProperty({ example: 'other', description: 'Guest sex', enum: SexEnum })
  @IsEnum(SexEnum)
  @IsOptional()
  readonly sex?: SexEnum

  @ApiProperty({ example: '123456789', description: 'Guest ID code' })
  @IsString()
  @IsOptional()
  readonly IDcode?: string

  @ApiProperty({ example: '@narutominecrafter', description: 'Guest Instagram' })
  @IsString()
  @IsOptional()
  readonly instagram?: string
}

export class CreateGuestDto {
  @IsNotEmpty()
  user: User

  @IsNotEmpty()
  event: Event

  @IsNotEmpty()
  ticket: Ticket
}

export class GetGuestDto {
  @ApiProperty({ example: '1', description: 'Guest id', required: false })
  @IsNumber()
  readonly id: number

  @ApiProperty({ example: '1', description: 'Event id', required: false })
  @IsNumber()
  readonly eventId: number

  @ApiProperty({ example: '1', description: 'Ticket id', required: false })
  @IsNumber()
  readonly ticketId: number
}
