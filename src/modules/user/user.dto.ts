import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsCreditCard,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MinLength
} from 'class-validator'
import { Location } from '../../types/location.types'
import { CardNumberType } from '../../types/payment.types'

export enum SexEnum {
  Man = 'man',
  Woman = 'woman'
}

export class CreateUserDto {
  @ApiProperty({ example: 'Kaneki', description: 'Name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly name!: string

  @ApiProperty({ example: 'Ken', description: 'Surname' })
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly surname!: string

  @ApiProperty({ example: '+380680123456', description: 'Phone' })
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone!: string

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsEmail()
  @IsOptional()
  readonly email: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Birthdate' })
  @IsOptional()
  @IsDateString()
  readonly birthdate: Date

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'User latitude/longitude location'
  })
  @IsObject()
  @IsOptional()
  readonly location: Location

  @ApiProperty({ example: '9999', description: 'ID code' })
  @IsNumberString()
  @IsOptional()
  readonly IDcode: string

  @ApiProperty({ example: '@example', description: 'Instagram' })
  @IsString()
  @IsOptional()
  readonly instagram?: string

  @ApiProperty({ example: 'I YouTuber', description: 'About user' })
  @IsString()
  @IsOptional()
  readonly aboutMe?: string

  @ApiProperty({ example: SexEnum.Man, description: 'Sex', enum: SexEnum })
  @IsOptional()
  @IsEnum(SexEnum)
  readonly sex?: SexEnum
}

export class GetUserDto {
  @ApiProperty({ example: 1, description: 'User id', required: false })
  @IsNumberString()
  @IsOptional()
  readonly id?: string
}

export class ChangeUserDto extends PartialType(CreateUserDto) {}

const CARD_EXPIRY_DATE = /^(0[1-9]|1[0-2])(2[2-9])$/

export class AddCardDto {
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
