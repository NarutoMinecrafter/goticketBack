import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested
} from 'class-validator'
import { ToDate } from '../../decorators/ToDate'
import { ToNumber } from '../../decorators/ToNumber'
import { Location } from '../../types/location.types'

export enum SexEnum {
  Men = 'men',
  Women = 'women',
  Uknown = 'uknown'
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
  @IsNotEmpty()
  readonly email!: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Birthdate' })
  @ToDate()
  @IsDate()
  @IsOptional()
  readonly birthdate?: Date

  @ApiProperty({
    example: { lat: 48.187019, lon: 23.88558 },
    description: 'User latitude/longitude location'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Location)
  @IsOptional()
  readonly location?: Location

  @ApiProperty({ example: '9999', description: 'ID code' })
  @IsNumberString()
  @IsOptional()
  readonly IDcode?: string

  @ApiProperty({ example: '@example', description: 'Instagram' })
  @IsString()
  @IsOptional()
  readonly instagram?: string

  @ApiProperty({ example: 'I YouTuber', description: 'About user' })
  @IsString()
  @IsOptional()
  readonly aboutMe?: string

  @ApiProperty({ example: SexEnum.Men, description: 'Sex', enum: SexEnum })
  @IsEnum(SexEnum)
  @IsOptional()
  readonly sex?: SexEnum
}

export class GetUserDto {
  @ApiProperty({ example: 1, description: 'User id', required: false })
  @ToNumber()
  @IsNumber()
  @IsOptional()
  readonly id?: number
}

export class ChangeUserDto extends PartialType(CreateUserDto) {}
