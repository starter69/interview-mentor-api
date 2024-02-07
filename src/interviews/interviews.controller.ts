import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { multerConfig } from 'src/utils/multer.config'
import * as ffmpeg from 'fluent-ffmpeg'
const ffmpegStatic = require('ffmpeg-static')
const ffprobeStatic = require('ffprobe-static')
import { InterviewsService } from './interviews.service'
import { CreateInterviewDto } from './dto/create-interview.dto'
import { UpdateInterviewDto } from './dto/update-interview.dto'

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
    ffmpeg.setFfmpegPath(ffmpegStatic)
    ffmpeg.setFfprobePath(ffprobeStatic.path)
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

    const thumbnailPath = `${file.destination}/thumbnails/${file.filename.split('.')[0]}.png`

    ffmpeg(filePath)
      .on('end', function () {
        console.log('Thumbnail generated successfully!')
      })
      .on('error', function (err) {
        console.error('Error generating thumbnail: ' + err.message)
      })
      .screenshots({
        timestamps: ['0.5%'],
        filename: `${file.filename.split('.')[0]}.png`,
        folder: file.destination + '/thumbnails',
        size: '320x240',
      })

    //@ts-ignore
    createInterviewDto.duration = metadata.format.duration
    await this.interviewService.createInterview(
      createInterviewDto,
      file.path,
      thumbnailPath.substring(2)
    )
  }

  @Get('search')
  async searchInterview(@Query('query') query: string) {
    return await this.interviewService.search(query)
  }

  @Get('user/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.interviewService.findByUserId(+id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.interviewService.findOne(+id)
  }

  @Get()
  findAll() {
    return this.interviewService.findAll()
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto
  ) {
    return this.interviewService.update(+id, updateInterviewDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(+id)
  }
}
