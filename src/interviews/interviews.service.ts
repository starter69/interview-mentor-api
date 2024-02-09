import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateInterviewDto } from './dto/create-interview.dto'
import { UpdateInterviewDto } from './dto/update-interview.dto'
import axios from 'axios'
import * as https from 'https'

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async createInterview(
    createInterviewDto: CreateInterviewDto,
    location: string,
    thumbnail_location: string
  ) {
    const interview = await this.prisma.interviews.create({
      data: {
        user_id: Number(createInterviewDto.user_id),
        name: createInterviewDto.name,
        date: new Date(),
        duration: Number(createInterviewDto.duration),
        path: location,
        thumbnail_path: thumbnail_location,
      },
    })
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    const user = await this.prisma.users.findUnique({
      where: { id: Number(createInterviewDto.user_id) },
    })

    // const username = user.name.charAt(0).toUpperCase() + user.name.slice(1)

    const notificationMessage = JSON.stringify({
      text: `@${user.name} uploaded an interview with ${createInterviewDto.name} (${Number(createInterviewDto.duration)}s). please visit http://192.168.101.57/interviews/${interview.id}/detail :tada:`,
    })

    const options = {
      url: 'https://team.jh.local/hooks/keya3ct1cfr9meamansbxkwabh',

      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer efnm4zd66fyn7qtyinrpe3ke3r',
      },
      data: notificationMessage,
      httpsAgent: agent,
    }

    await axios.request(options)

    return interview
  }

  findAll() {
    return this.prisma.interviews.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
  }

  async findOne(id: number) {
    return await this.prisma.interviews.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  async findByUserId(userId: number) {
    return await this.prisma.interviews.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
  }

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    const updatedInterview = await this.prisma.interviews.update({
      where: { id },
      data: { name: updateInterviewDto.company_name },
    })
    return updatedInterview
  }

  async remove(id: number) {
    await this.prisma.interviews.delete({
      where: { id },
    })
  }

  async search(query: string) {
    const result = await this.prisma.interviews.findMany({
      where: {
        OR: [
          {
            name: { contains: query, mode: 'insensitive' },
          },
          {
            user: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    })
    return result
  }
}
