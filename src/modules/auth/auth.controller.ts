import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LoginDto, PhoneDto } from './auth.dto'
import { AuthService } from './auth.service'
import { CreateUserDto } from './../user/user.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ schema: { example: { authorized: false, confirmed: true } } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @ApiOkResponse({ schema: { example: { token: 'UR.AUTH.TOCKEN' } } })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @ApiOkResponse({ schema: { example: { code: 1000 } } })
  @Post('send-code')
  sendCode(@Body() dto: PhoneDto) {
    return this.authService.sendCode(dto)
  }
}
