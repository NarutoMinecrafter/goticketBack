import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Event } from '../event/event.entity'
import { User } from '../user/user.entity'

export enum Permissions {
  QRScanner = 0,
  GuestConfirmation = 1,
  CreateReferralLinks = 2,
  EditEvent = 3,
  EditAccess = 4
}

@Entity()
export class Editor {
  @ApiProperty({ description: 'Editor id', example: 256 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'User of this editor', example: () => User, type: () => User })
  @ManyToOne(() => User, user => user.editors)
  user: User

  @ApiProperty({ description: 'Event of this editor', example: () => Event, type: () => Event })
  @ManyToOne(() => Event, event => event.editors)
  event: Event

  @ApiProperty({
    description: 'Editor permissions',
    example: [Permissions.CreateReferralLinks, Permissions.EditAccess],
    enum: Permissions,
    isArray: true
  })
  @Column('text', { array: true, nullable: false, default: [] })
  permissions: Permissions[]
}
