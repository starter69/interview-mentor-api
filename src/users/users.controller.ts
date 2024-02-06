import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { Roles } from 'src/auth/decorator/roles.decorator'

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.create(createUserDto)
      return res
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Username already exists.' },
        HttpStatus.CONFLICT,
        {
          cause: error,
        }
      )
    }
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }

  @Put('update-password')
  async updatePassword(@Body() data: UpdatePasswordDto) {
    return await this.usersService.updatePassword(data)
  }
}
