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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import CreatePostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'
import RequestWithUser from '../auth/interfaces/requestWithUser.interface'
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard'
import PostEntity from './post.entity'

@Controller('api/v1/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  async getAllPosts(@Query('search') search: string): Promise<PostEntity[]> {
    if (search) {
      return this.postsService.searchForPosts(search)
    }
    return await this.postsService.getAllPosts()
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id): Promise<PostEntity> {
    return this.postsService.getPostById(id)
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createPost(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, req.user)
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  updatePost(@Param('id', ParseIntPipe) id, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  deletePost(@Param('id', ParseIntPipe) id): Promise<void> {
    return this.postsService.deletePost(id)
  }
}
