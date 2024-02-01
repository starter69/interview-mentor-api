import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InterviewsService } from './interviews.service'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { CreateInterviewDto } from './dto/create-interview.dto'
import { multerConfig } from 'src/utils/multer.config'
import * as ffmpeg from 'fluent-ffmpeg'
import * as ffprobeStatic from 'ffprobe-static'

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewService: InterviewsService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInterviewDto: CreateInterviewDto
  ) {
    ffmpeg.setFfmpegPath(ffprobeStatic.path)
    const filePath = `${file.destination}/${file.filename}`

    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err)
        } else {
          resolve(metadata)
        }
      })
    })
    //@ts-ignore
    createInterviewDto.duration = metadata.format.duration
    await this.interviewService.createInterview(createInterviewDto, file.path)
  }
}
