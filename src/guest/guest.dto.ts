import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator'
import { Event } from '../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { User } from '../user/user.entity'
import { GuestStatus } from './guest.entity'

export class CreateGuestDto {
  @IsNotEmpty()
  user: User

  @IsNotEmpty()
  event: Event

  @IsNotEmpty()
  ticket: Ticket
}

export class RequiredGuestDto {
  @ApiProperty({ example: '1', description: 'Guest id', required: true })
  @IsNotEmpty()
  @IsNumberString()
  readonly id: string

  @ApiProperty({ example: '1', description: 'Event id', required: true })
  @IsNotEmpty()
  @IsNumberString()
  readonly eventId: string
}

export class GetGuestDto extends PartialType(RequiredGuestDto) {}

export class ChangeGuestStatusDto {
  @ApiProperty({ example: 1, description: 'Guest id', required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number

  @ApiProperty({ enum: GuestStatus, example: GuestStatus.Accepted, description: 'Guest status', required: true })
  @IsEnum(GuestStatus)
  @IsNotEmpty()
  readonly status: GuestStatus
}