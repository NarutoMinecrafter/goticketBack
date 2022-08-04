import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ToNumber } from '../../decorators/ToNumber'

export class GetBankAccountDto {
  @ApiProperty({ description: 'Bank account id', example: '123' })
  @ToNumber()
  @IsNumber()
  @IsOptional()
  id: number
}

export class CreateBankAccountDto {
  @ApiProperty({ description: 'Name of bank account author', example: 'Kiril' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Surname of bank account author', example: 'Baranov' })
  @IsString()
  @IsNotEmpty()
  surname: string

  @ApiProperty({ description: 'Bank number', example: 'GB29 NWBK 6016 1331 9268 19' })
  @IsString()
  @IsOptional()
  bankNumber?: string

  @ApiProperty({ description: 'Bank account number', example: 123 })
  @IsString()
  @IsOptional()
  bankAccountNumber?: string

  @ApiProperty({ description: 'ID Code', example: '123' })
  @IsString()
  @IsOptional()
  idCode?: string
}

export class DeleteBankAccountDto {
  @ApiProperty({ description: 'Bank account id', example: 123 })
  @IsNumber()
  @IsNotEmpty()
  id: number
}
