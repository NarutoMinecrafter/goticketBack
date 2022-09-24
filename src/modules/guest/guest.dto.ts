import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested
} from 'class-validator'
import { ToNumber } from '../../decorators/ToNumber'
import { Event } from '../event/event.entity'
import { Ticket, TicketPriceTypes } from '../ticket/ticket.entity'
import { User } from '../user/user.entity'
import { GuestStatus, PaymentStatus } from './guest.entity'

export class CreateGuestDto {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => User)
  user: User

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Event)
  event: Event

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Event)
  ticket: Ticket

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  buyCount: number

  @IsEnum(TicketPriceTypes)
  @IsOptional()
  priceType?: TicketPriceTypes

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus
}

export class RequiredGuestDto {
  @ApiProperty({ example: 1, description: 'Guest id', required: true })
  @ToNumber()
  @IsNotEmpty()
  @IsNumber()
  readonly id: number

  @ApiProperty({ example: 1, description: 'Event id', required: true })
  @ToNumber()
  @IsNotEmpty()
  @IsNumber()
  readonly eventId: number
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
