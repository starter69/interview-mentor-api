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
} from '@nestjs/common'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { TeamsService } from './teams.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@UseGuards(JwtGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    try {
      const res = await this.teamsService.create(createTeamDto)
      return res;
    } catch (error) {
      throw new HttpException({status: HttpStatus.CONFLICT,
      error: 'Team name already exists.'}, HttpStatus.CONFLICT, {
        cause: error
      })
    }
    
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.teamsService.findAll()
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id)
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto)
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id)
  }
}
