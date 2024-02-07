import { IsNotEmpty, IsString, IsNumber} from 'class-validator'

export class ResetPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number
  
  @IsString()
  @IsNotEmpty()
  password: string
}
