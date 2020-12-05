import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  title: string
}

export default CreatePostDto
