import { IsNotEmpty, IsString } from 'class-validator'

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  duration: string
}
