import { Role } from '@prisma/client'
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  team_id: number

  @IsEnum(Role)
  @IsNotEmpty()
  role: string
}
