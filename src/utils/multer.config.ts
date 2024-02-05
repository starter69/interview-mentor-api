import { HttpException, HttpStatus } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { getDate } from './getDate'
import * as ffmpeg from 'fluent-ffmpeg'
const ffmpegStatic = require('ffmpeg-static')

export const multerConfig = {
  storage: diskStorage({
    destination: `./materials`,
    //i think this is not right way....
    filename: (req, file, cb) => {
      // @ts-ignore
      const username = req.user.name
      const date = getDate()
      const originalFilename = `${username}_${req.body.name}_${date}`

      // Convert video to mp4 format after saving
      console.error('ffmpegStatic>>', ffmpegStatic)
      ffmpeg.setFfmpegPath(ffmpegStatic)
      const destination = join(__dirname, '..', '..', 'materials')
      // it will be right way....
      console.log('destination>>', destination)
      const filePath = `${originalFilename}${extname(file.originalname)}`

      console.log('filePath>>', filePath)
      const outputFilePath = `${__dirname}/../../../output/${originalFilename}.mp4`
      console.log('outputFilePath>>', outputFilePath)
      cb(null, filePath)
      ffmpeg(`${__dirname}/../../../materials/${filePath}`)
        .output(outputFilePath)
        .on('end', () => {
          console.log('Conversion finished')
          // Here you can update the file path in the database
        })
        .on('error', (err) => {
          console.error('Error occurred during conversion: ', err)
          // Handle the error
        })
        .run()
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.3gp', '.avi', '.mp4', '.wmv']

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
