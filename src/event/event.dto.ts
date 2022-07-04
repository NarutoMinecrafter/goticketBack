import { ApiProperty } from '@nestjs/swagger'
import { ArrayMaxSize, IsArray, IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateEventDto {
  @ApiProperty({ example: 'Comic con', description: 'Title' })
  @IsString()
  @IsNotEmpty()
  readonly title!: string

  @ApiProperty({ example: 'Anime fest', description: 'Short description' })
  @IsString()
  @IsNotEmpty()
  readonly shortDescription!: string

  @ApiProperty({ example: 'Very cool anime festival', description: 'Full description' })
  @IsString()
  readonly fullDescription: string

  @ApiProperty({ example: '2022-02-24T02:00:00.777Z', description: 'Start date' })
  @IsDateString()
  readonlystartDate!: string

  @ApiProperty({ example: '2022-02-27T02:00:00.777Z', description: 'End date' })
  @IsDateString()
  readonlyendDate: string

  @ApiProperty({ example: ['https://youtu.be/dQw4w9WgXcQ'], description: 'Demo videos or pictures' })
  @IsArray()
  @ArrayMaxSize(3)
  readonly demo: string[]

  @ApiProperty({ example: '5555', description: 'Bank account' })
  @IsString()
  @IsNotEmpty()
  readonly bank!: string
}
