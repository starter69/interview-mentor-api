import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class UpdatePasswordDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsString()
  @IsNotEmpty()
  old_password: string

  @IsString()
  @IsNotEmpty()
  new_password: string
}
