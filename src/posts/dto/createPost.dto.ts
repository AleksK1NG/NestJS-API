import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[]
}

export default CreatePostDto
