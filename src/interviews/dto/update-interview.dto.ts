import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateInterviewDto {
  @IsString()
  @IsNotEmpty()
  company_name: string
}
