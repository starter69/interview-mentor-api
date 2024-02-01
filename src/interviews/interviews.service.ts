import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateInterviewDto } from './dto/create-interview.dto'

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async createInterview(
    createInterviewDto: CreateInterviewDto,
    location: string
  ) {
    return this.prisma.interviews.create({
      data: {
        user_id: Number(createInterviewDto.user_id),
        name: createInterviewDto.name,
        date: new Date(),
        duration: Number(createInterviewDto.duration),
        path: location,
      },
    })
  }
}
