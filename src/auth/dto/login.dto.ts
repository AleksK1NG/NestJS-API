import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LogInDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}

export default LogInDto
