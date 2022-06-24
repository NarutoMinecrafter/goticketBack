import { CreateUserDto } from './../user/user.dto'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CodeDto } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: CodeDto) {
    return this.authService.login(dto)
  }

  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @Post('/send-code')
  sendCode(@Body() dto: CodeDto) {
    return this.authService.sendCode(dto)
  }
}
