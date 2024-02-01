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

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewService: InterviewsService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig('')))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInterviewDto: CreateInterviewDto
  ) {
    const multerConfigWithParams = multerConfig(createInterviewDto.name)
    UseInterceptors(FileInterceptor('file', multerConfigWithParams))
    await this.interviewService.createInterview(createInterviewDto, file.path)
  }
}
