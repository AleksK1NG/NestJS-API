import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('api/v1/posts')
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

  // @Get(':id')
  // getPostById(@Param('id') id: string) {
  //   return this.postsService.getPostById(Number(id))
  // }
  //
  // @Post()
  // async createPost(@Body() post: CreatePostDto) {
  //   return this.postsService.createPost(post)
  // }
  //
  // @Put(':id')
  // async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
  //   return this.postsService.replacePost(Number(id), post)
  // }
  //
  // @Delete(':id')
  // async deletePost(@Param('id') id: string) {
  //   this.postsService.deletePost(Number(id))
  // }
}
