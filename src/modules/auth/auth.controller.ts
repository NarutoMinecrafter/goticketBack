import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto, PhoneDto } from './auth.dto'
import { AuthService } from './auth.service'
import { CreateUserDto } from './../user/user.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @Post('send-code')
  sendCode(@Body() dto: PhoneDto) {
    return this.authService.sendCode(dto)
  }
}
