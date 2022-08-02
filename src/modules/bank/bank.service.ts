import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BankAccount } from './bank.entity'
import { CreateBankAccountDto } from './bank.dto'
import { User } from '../user/user.entity'

@Injectable()
export class BankAccountService {
  constructor(@InjectRepository(BankAccount) private readonly bankAccountRepository: Repository<BankAccount>) {}

  getBy<T extends keyof BankAccount>(key: T, value: BankAccount[T]) {
    return this.bankAccountRepository.findOne({
      where: { [key]: value },
      relations: ['user']
    })
  }

  getByUserId(userId: number) {
    return this.bankAccountRepository.find({
      where: {
        user: {
          id: userId
        }
      },
      relations: ['user']
    })
  }

  create(bankAccount: CreateBankAccountDto, user: User) {
    return this.bankAccountRepository.save({ ...bankAccount, user })
  }

  async delete(id: number, user: User) {
    const bankAccount = await this.getBy('id', id)

    if (!bankAccount) {
      throw new BadRequestException('Bank account not found')
    }

    // @ts-ignore
    if (bankAccount?.user.id !== user.id) {
      throw new ForbiddenException('You can not delete this bank account')
    }

    const result = await this.bankAccountRepository.delete(bankAccount.id)

    return Boolean(result.affected)
  }
}
