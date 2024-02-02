import { HttpException, HttpStatus } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { getDate } from './getDate'

export const multerConfig = {
  storage: diskStorage({
    destination: './materials',
    filename: (req, file, cb) => {
      // @ts-ignore
      const username = req.user.name
      const date = getDate()
      return cb(
        null,
        `${username}_${req.body.name}_${date}${extname(file.originalname)}`
      )
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.3gp', '.avi', '.mp4']

    const fileExt = extname(file.originalname)
    if (allowedExtensions.includes(fileExt)) {
      cb(null, true)
    } else {
      cb(
        new HttpException(`Unsupported file type`, HttpStatus.BAD_REQUEST),
        false
      )
    }
  },
}
