import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/auth.guard'
import { Event } from '../event/event.entity'
import { User } from '../user/user.entity'
import { CreateBankAccountDto, DeleteBankAccountDto, GetBankAccountDto } from './bank.dto'
import { BankAccountService } from './bank.service'
import { BankAccount } from './bank.entity'

@ApiTags('Bank Account')
@Controller('bank')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Event, description: 'Create Bank account' })
  @Get()
  getAll(@Req() { user }: Record<'user', User>) {
    return this.bankAccountService.getByUserId(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Event, description: 'Create Bank account' })
  @Get()
  getById(@Query() { id }: GetBankAccountDto) {
    return this.bankAccountService.getBy('id', Number(id))
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BankAccount, description: 'Create Bank account' })
  @Post()
  create(@Body() dto: CreateBankAccountDto, @Req() { user }: Record<'user', User>) {
    return this.bankAccountService.create(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean, description: 'Delete Bank account' })
  @Delete()
  delete(@Body() dto: DeleteBankAccountDto, @Req() { user }: Record<'user', User>) {
    return this.bankAccountService.delete(dto.id, user)
  }
}
