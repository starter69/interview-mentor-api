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
import { TeamsService } from './teams.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@UseGuards(JwtGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

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

  @Get()
  findAll() {
    return this.teamsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id)
  }
}
