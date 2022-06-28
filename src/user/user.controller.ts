import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from './user.entity'
import { GetUserDto } from './user.dto'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  get(@Query() { id }: GetUserDto) {
    if (id) {
      return this.userService.getBy('id', Number(id))
    }

    return this.userService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() { user }: Record<'user', User | null | undefined>) {
    return user
  }
}
