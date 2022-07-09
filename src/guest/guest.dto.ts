import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator'
import { Event } from '../event/event.entity'
import { Ticket } from '../ticket/ticket.entity'
import { User } from '../user/user.entity'

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
  @IsOptional()
  @IsNumberString()
  readonly id?: string
}
