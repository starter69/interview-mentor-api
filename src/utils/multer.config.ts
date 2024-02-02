import { HttpException, HttpStatus } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { getDate } from './getDate'

export const multerConfig = {
  storage: diskStorage({
    destination: './interviews',
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
    const allowedExtensions = ['.wmv', '.avi', '.mp4'] // Add your allowed extensions here

    const fileExt = extname(file.originalname)
    if (allowedExtensions.includes(fileExt)) {
      cb(null, true) // Accept the file
    } else {
      cb(
        new HttpException(`Unsupported file type`, HttpStatus.BAD_REQUEST),
        false
      )
    }
  },
}
