import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const createdTeam = await this.prisma.teams.create({
      data: {
        name: createTeamDto.name,
      },
    })
    return createdTeam
  }

  findAll() {
    return this.prisma.teams.findMany()
  }

  findOne(id: number) {
    return this.prisma.teams.findUnique({
      where: { id },
    })
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = await this.prisma.teams.update({
      where: { id },
      data: updateTeamDto,
    })
    return updatedTeam
  }

  async remove(id: number) {
    await this.prisma.teams.delete({
      where: { id },
    })
  }
}
