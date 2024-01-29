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

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewService: InterviewsService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInterviewDto: CreateInterviewDto
  ) {
    const video = await this.interviewService.createInterview(
      createInterviewDto,
      file.path
    )
    console.log(video)
  }
}
