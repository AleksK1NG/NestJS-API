import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import CreatePostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'

@Controller('api/v1/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  async getAllPosts(@Query() query) {
    const posts = await this.postsService.getAllPosts()
    return {
      status: 200,
      posts,
      query,
    }
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id) {
    return this.postsService.getPostById(id)
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto)
  }

  @Put(':id')
  updatePost(@Param('id', ParseIntPipe) id, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost({
      ...updatePostDto,
      id,
    })
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id) {
    return this.postsService.deletePost(id)
  }
}
