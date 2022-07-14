import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { access, mkdir } from 'fs/promises'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from './user.entity'
import { AddCardDto, ChangeUserDto, GetUserDto } from './user.dto'

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
    return this.userService.changeUser(dto, user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Boolean, description: 'Add payment card' })
  @Post('/add-card')
  addCard(@Body() dto: AddCardDto, @Req() { user }: Record<'user', User>) {
    return this.userService.addCard(dto, user)
  }

  // TODO: Update
  @UseGuards(JwtAuthGuard)
  @Put('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(_req, file, callback) {
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Invalid file type'), false)
        }

        callback(null, true)
      },
      storage: diskStorage({
        async destination(req, _file, callback) {
          const user = req.user as User
          const path = `./static/user/${user.id}`

          try {
            await access(path)
          } catch (_error) {
            await mkdir(path, { recursive: true })
          }

          callback(null, path)
        },
        filename(_req, file, callback) {
          callback(null, `avatar.${file.originalname.split('.').slice(-1)}`)
        }
      })
    })
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() { user }: Record<'user', User>) {
    return this.userService.update({ id: user.id, avatar: file.path.replaceAll('\\', '/') })
  }
}
