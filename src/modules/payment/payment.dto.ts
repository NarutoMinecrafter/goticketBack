import { ApiProperty } from '@nestjs/swagger'
import { IsCreditCard, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Matches } from 'class-validator'
import { CardNumberType } from '../../types/payment.types'

const CARD_EXPIRY_DATE = /^(0[1-9]|1[0-2])(2[2-9])$/

export class CreatePaymentDto {
  @ApiProperty({ example: 2323_2323_2323_2323, description: 'Card number', required: true })
  @IsNotEmpty()
  @IsCreditCard()
  readonly cardNumber: CardNumberType

  @ApiProperty({ example: '0523', description: 'Card exp date, fromat MMYY', required: true })
  @IsNumberString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(CARD_EXPIRY_DATE)
  readonly cardExpiry: string

  @ApiProperty({ example: '123', description: 'Card cvv', required: true })
  @IsNumberString()
  @IsNotEmpty()
  @Length(3, 4)
  readonly cardCVV: string

  @ApiProperty({ example: 'Kirill Baranov', description: 'Card holder', required: true })
  @IsString()
  @IsNotEmpty()
  readonly cardHolder: string
}

export class RemovePaymentDto {
  @ApiProperty({ example: 123, description: 'Payment id', required: true })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}

export class SelectPaymentDto {
  @ApiProperty({ example: 123, description: 'Payment id', required: true })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}
