import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostRepository } from './post.repository'

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
