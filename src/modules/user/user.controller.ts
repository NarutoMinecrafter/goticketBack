import { Body, Controller, Get, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { User } from './user.entity'
import { AddCardDto, ChangeUserDto, GetUserDto } from './user.dto'
import { JwtAuthGuard } from '../auth/auth.guard'
import { fileInterceptor } from './user.interceptor'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ type: User, description: 'User with specified id' })
  @ApiResponse({ type: User, isArray: true, description: 'All users if id is not specified' })
  @Get()
  get(@Query() { id }: GetUserDto) {
    if (id) {
      return this.userService.getById(Number(id))
    }

    return this.userService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User, description: 'Current user' })
  @Get('profile')
  profile(@Req() { user }: Record<'user', User>) {
    return this.userService.getBy('id', user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean, description: 'Change current user ' })
  @Put('profile')
  change(@Body() dto: ChangeUserDto, @Req() { user }: Record<'user', User>) {
    return this.userService.update({ id: user.id, ...dto })
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Boolean, description: 'Add payment card' })
  @Post('/add-card')
  addCard(@Body() dto: AddCardDto, @Req() { user }: Record<'user', User>) {
    return this.userService.addCard(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @Put('avatar')
  @UseInterceptors(fileInterceptor)
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() { user }: Record<'user', User>) {
    return this.userService.update({ id: user.id, avatar: file.path.replaceAll('\\', '/') })
  }
}
