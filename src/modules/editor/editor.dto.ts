import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Permissions } from './editor.entity'
import { Event } from '../event/event.entity'

export class EditorDto {
  @ApiProperty({ example: 123, description: 'User id', required: true })
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number

  @ApiProperty({
    description: 'Editor permissions',
    example: [Permissions.CreateReferralLinks, Permissions.EditAccess],
    enum: Permissions,
    isArray: true,
    required: true
  })
  @IsEnum(Permissions, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  readonly permissions: Permissions[]
}

export class CreateEditorDto extends EditorDto {
  readonly event: Event
}
