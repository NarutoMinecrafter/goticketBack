import { Module } from '@nestjs/common'
import { BankAccountService } from './bank.service'
import { BankAccountController } from './bank.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BankAccount } from './bank.entity'

@Module({
  providers: [BankAccountService],
  controllers: [BankAccountController],
  imports: [TypeOrmModule.forFeature([BankAccount])]
})
export class BankModule {}
