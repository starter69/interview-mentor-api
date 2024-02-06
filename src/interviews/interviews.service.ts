import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateInterviewDto } from './dto/create-interview.dto'
import { UpdateInterviewDto } from './dto/update-interview.dto'

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

  findAll() {
    return this.prisma.interviews.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
  }

  async findOne(id: number) {
    return await this.prisma.interviews.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
  }

  async findByUserId(userId:number) {
    return await this.prisma.interviews.findMany({
      where: {
        user_id: userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
  }

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    const updatedInterview = await this.prisma.interviews.update({
      where: { id },
      data: UpdateInterviewDto,
    })
    return updatedInterview
  }

  async remove(id: number) {
    await this.prisma.interviews.delete({
      where: {id},
    })
  }
}
