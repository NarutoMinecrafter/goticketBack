import { BadRequestException } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

// TODO: Update
export const filesInterceptor = FilesInterceptor('files', 3, {
  fileFilter(_req, file, callback) {
    if (!(file.mimetype.includes('image') || file.mimetype.includes('video'))) {
      return callback(new BadRequestException('Invalid file type'), false)
    }

    callback(null, true)
  },
  storage: diskStorage({
    destination: './static/event',
    filename(_req, file, callback) {
      callback(null, `${Date.now()}.${file.originalname.split('.').slice(-1)}`)
    }
  })
})
