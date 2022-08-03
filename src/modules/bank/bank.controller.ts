import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/auth.guard'
import { User } from '../user/user.entity'
import { CreateBankAccountDto, DeleteBankAccountDto, GetBankAccountDto } from './bank.dto'
import { BankAccountService } from './bank.service'
import { BankAccount } from './bank.entity'

@ApiTags('Bank Account')
@Controller('bank')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BankAccount, description: 'Bank account with specified id' })
  @ApiResponse({ type: BankAccount, isArray: true, description: 'All user back accounts if id is not specified' })
  @Get()
  get(@Req() { user }: Record<'user', User>, @Query() { id }: GetBankAccountDto) {
    if (id) {
      return this.bankAccountService.getBy('id', id)
    }

    return this.bankAccountService.getByUserId(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BankAccount, description: 'Create Bank account' })
  @Post()
  create(@Body() dto: CreateBankAccountDto, @Req() { user }: Record<'user', User>) {
    return this.bankAccountService.create(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean, description: 'Delete Bank account' })
  @Delete()
  delete(@Body() { id }: DeleteBankAccountDto, @Req() { user }: Record<'user', User>) {
    return this.bankAccountService.delete(id, user)
  }
}
