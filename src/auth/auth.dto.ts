import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class PhoneDto {
  @ApiProperty({ example: '+380680123456', description: 'Phone' })
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string
}

export class CodeDto extends PhoneDto {
  @ApiProperty({ example: 1234, description: 'Code' })
  @IsNumber()
  @IsNotEmpty()
  readonly code: number
}

export class LoginDto extends CodeDto {
  @ApiProperty({ description: 'Push notification token', example: 'YOUR NOTIFICATION TOKEN' })
  @IsString()
  @IsOptional()
  pushNotificationToken?: string
}
