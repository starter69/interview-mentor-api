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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { multerConfig } from 'src/utils/multer.config'
import * as ffmpeg from 'fluent-ffmpeg'
import * as ffprobeStatic from 'ffprobe-static'
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.interviewService.findOne(+id)
  }

  @Get('user/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.interviewService.findByUserId(+id)
  }
  
  @Get()
  findAll() {
    return this.interviewService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewService.update(+id, updateInterviewDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(+id)
  }
}
