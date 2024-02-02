import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '@prisma/client'
import * as argon from 'argon2'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.prisma.users.create({
      data: {
        name: createUserDto.name,
        password: await argon.hash('12345678'),
        team_id: createUserDto.team_id > 0 ? createUserDto.team_id : null,
        role: createUserDto.team_id === 0 ? Role.ADMIN : Role.USER,
      },
    })
    return createdUser
  }

  findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        team_id: true,
        team: {
          select: {
            name: true
          }
        }
      }
    })
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        password: await argon.hash(updateUserDto.password),
        team_id: updateUserDto.team_id > 0 ? updateUserDto.team_id : null,
        role:
          updateUserDto.role === 'ADMIN'
            ? Role.ADMIN
            : updateUserDto.role === 'LEAD'
              ? Role.LEAD
              : Role.USER,
      },
    })
    return updatedUser
  }

  async remove(id: number) {
    await this.prisma.users.delete({
      where: { id },
    })
  }
}
