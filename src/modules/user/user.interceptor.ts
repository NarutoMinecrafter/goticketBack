import { BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { access, mkdir } from 'fs/promises'
import { User } from './user.entity'

// TODO: Update
export const fileInterceptor = FileInterceptor('image', {
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
