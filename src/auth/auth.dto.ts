import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPhoneNumber } from 'class-validator'

export class PhoneDto {
  @ApiProperty({ example: '+380680123456', description: 'Phone' })
  @IsPhoneNumber()
  readonly phone!: string
}

export class CodeDto extends PhoneDto {
  @ApiProperty({ example: '1234', description: 'Code' })
  @IsNumber()
  readonly code!: number
}
