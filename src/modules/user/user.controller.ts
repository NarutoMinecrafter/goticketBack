import { Payment } from '../payment/payment.entity'
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { User } from './user.entity'
import { ChangeUserDto, GetUserDto } from './user.dto'
import { JwtAuthGuard } from '../auth/auth.guard'
import { fileInterceptor } from './user.interceptor'
import { CreatePaymentDto, RemovePaymentDto, SelectPaymentDto } from '../payment/payment.dto'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ type: User, description: 'User with specified id' })
  @ApiResponse({ type: User, isArray: true, description: 'All users if id is not specified' })
  @Get()
  get(@Query() { id }: GetUserDto) {
    if (id) {
      return this.userService.getById(id)
    }

    return this.userService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, description: 'Current user' })
  @Get('profile')
  profile(@Req() { user }: Record<'user', User>) {
    return this.userService.getBy('id', user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean, description: 'Change current user ' })
  @Put('profile')
  change(@Body() dto: ChangeUserDto, @Req() { user }: Record<'user', User>) {
    return this.userService.update({ id: user.id, ...dto })
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: Boolean, description: 'Add payment card' })
  @Post('/add-payment')
  addCard(@Body() dto: CreatePaymentDto, @Req() { user }: Record<'user', User>) {
    return this.userService.addPayment(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: Boolean, description: 'Remove payment card' })
  @Delete('/payments')
  removeCard(@Query() { id }: RemovePaymentDto, @Req() { user }: Record<'user', User>) {
    return this.userService.removePayment(id, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Payment, isArray: true, description: 'Current user payments' })
  @Get('payments')
  getPayments(@Req() { user }: Record<'user', User>) {
    return this.userService.getPayments(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Payment, description: 'Current user selected payment' })
  @Get('payments/selected')
  getSelectedPayment(@Req() { user }: Record<'user', User>) {
    return this.userService.getSelectedPayment(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('select-card')
  selectPayment(@Body() dto: SelectPaymentDto, @Req() { user }: Record<'user', User>) {
    return this.userService.selectPayment(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('avatar')
  @UseInterceptors(fileInterceptor)
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() { user }: Record<'user', User>) {
    return this.userService.update({ id: user.id, avatar: file.path.replaceAll('\\', '/') })
  }
}
