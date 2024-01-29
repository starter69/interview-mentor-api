import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateInterviewDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  duration: number
}
