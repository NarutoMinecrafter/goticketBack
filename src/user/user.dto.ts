import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength
} from 'class-validator'
import { Location } from '../event/event.entity'

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

export class ChangeUserDto extends PartialType(CreateUserDto) {
}
