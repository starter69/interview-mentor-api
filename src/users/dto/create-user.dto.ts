import { Role } from '@prisma/client'
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsNumber()
  @IsNotEmpty()
  team_id: number

  @IsEnum(Role)
  @IsNotEmpty()
  role: string
}
