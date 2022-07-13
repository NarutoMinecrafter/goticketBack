import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator'

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
