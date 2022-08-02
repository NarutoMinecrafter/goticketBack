import { Module } from '@nestjs/common'
import { BankAccountService } from './bank.service'
import { BankAccountController } from './bank.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BankAccount } from './bank.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [BankAccountService],
  controllers: [BankAccountController]
})
export class BankModule {}
