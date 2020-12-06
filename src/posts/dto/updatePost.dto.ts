import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePostDto {
  @IsNumber()
  @IsOptional()
  id: number

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string

  @IsString({ each: true })
  @IsNotEmpty()
  @IsOptional()
  paragraphs: string[]
}

export default UpdatePostDto
