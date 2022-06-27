import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsOptional, IsPhoneNumber, MinLength } from 'class-validator'

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

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Bithdate' })
  @IsDate()
  readonly bithdate: Date

  @ApiProperty({ example: '123456789', description: 'ID code' })
  readonly IDcode: string

  @ApiProperty({ example: '@example', description: 'Instagram' })
  @IsOptional()
  readonly instagram?: string
}
