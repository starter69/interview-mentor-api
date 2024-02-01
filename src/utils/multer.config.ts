import { HttpException, HttpStatus } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname } from 'path'

export const multerConfig = (name: string) => ({
  storage: diskStorage({
    destination: './interviews',
    filename: (req, file, cb) => {
      // @ts-ignore
      const username = req.user.name
      console.log(username, name)
      return cb(null, `${username}_${name}_${extname(file.originalname)}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.wmv', '.api', '.mp4'] // Add your allowed extensions here

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
})
