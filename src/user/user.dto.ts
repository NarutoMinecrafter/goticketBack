import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength } from 'class-validator'

export enum SexEnum {
  Man = 'man',
  Woman = 'woman'
}

export class CreateUserDto {
  @ApiProperty({ example: 'Kaneki', description: 'Name' })
  @MinLength(2)
  readonly name!: string

  @ApiProperty({ example: 'Ken', description: 'Surname' })
  @MinLength(2)
  readonly surname!: string

  @ApiProperty({ example: '+380680123456', description: 'Phone' })
  @IsPhoneNumber()
  readonly phone!: string

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Birthday' })
  @IsDate()
  readonly birthday: Date

  @ApiProperty({ example: '123456789', description: 'ID code' })
  @IsDateString()
  readonly IDcode: string

  @ApiProperty({ example: '@example', description: 'Instagram' })
  @IsOptional()
  readonly instagram?: string

  @ApiProperty({ example: 'man', description: 'sex' })
  @IsEnum(SexEnum)
  readonly sex?: SexEnum
}

export class GetUserDto {
  @ApiProperty({ example: '1', description: 'User id', required: false })
  id?: string
}
