import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostRepository } from './post.repository'
import { SearchModule } from '../search/search.module'
import { PostsSearchService } from './postsSearch.service'

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository]), SearchModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
