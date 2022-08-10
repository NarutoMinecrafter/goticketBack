import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'

export enum BankAccountType {
  IndividualEntrepreneur = 'individual',
  Company = 'company',
  CommonUser = 'common'
}

@Entity()
export class BankAccount {
  @ApiProperty({ description: 'Payment id', example: '1' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of bank account author', example: 'Kiril' })
  @Column({ nullable: false })
  name: string

  @ApiProperty({ description: 'Surname of bank account author', example: 'Baranov' })
  @Column({ nullable: false })
  surname: string

  @ApiProperty({ description: 'Bank number', example: 'GB29 NWBK 6016 1331 9268 19' })
  @Column({ nullable: true })
  bankNumber?: string

  @ApiProperty({ description: 'Bank account number', example: '123' })
  @Column({ nullable: true })
  bankAccountNumber?: string

  @ApiProperty({ description: 'ID Code', example: '123' })
  @Column({ nullable: true })
  idCode?: string

  @ApiProperty({ type: () => [User], description: 'Author', example: () => User })
  @ManyToOne(() => User, user => user.payments)
  user: User
}
