import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CardNumberType, TokenType } from '../../types/payment.types'
import { User } from '../user/user.entity'

@Entity()
export class Payment {
  @ApiProperty({ description: 'Payment id', example: '1' })
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  paymentToken?: TokenType

  @Column({ nullable: true })
  paymentCVV?: string

  @ApiProperty({ description: 'User payment CVV code', example: 'Kiril Baranov' })
  @Column({ nullable: true })
  paymentCardHolder: string

  @ApiProperty({ description: 'User formatted card', example: '44** **** **** 9000' })
  @Column({ nullable: true })
  formattedCardNumber: CardNumberType

  @ApiProperty({ description: 'Is selected payment', example: true })
  @Column({ nullable: false, default: true })
  isSelected?: boolean

  @ManyToOne(() => User, user => user.payments)
  user: User
}
