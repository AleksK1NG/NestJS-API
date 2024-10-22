import { Injectable } from '@nestjs/common'
import UpdatePostDto from './dto/updatePost.dto'
import CreatePostDto from './dto/createPost.dto'
import { PostRepository } from './post.repository'
import Post from './post.entity'
import User from '../users/entities/user.entity'
import { PostsSearchService } from './postsSearch.service'
import { In } from 'typeorm'

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postsSearchService: PostsSearchService,
  ) {}

  async getAllPosts(offset?: number, limit?: number, startId?: number): Promise<{ items: Post[]; count: number }> {
    return this.postRepository.getAllPosts(offset, limit, startId)
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.getPostById(id)
  }

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const newPost = await this.postRepository.createPost(createPostDto, user)
    await this.postsSearchService.indexPost(newPost)
    return newPost
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postRepository.updatePost(id, updatePostDto)
    await this.postsSearchService.update(updatedPost)
    return updatedPost
  }

  async deletePost(id: number): Promise<void> {
    await this.postsSearchService.remove(id)
    return this.postRepository.deletePost(id)
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ): Promise<{ items: Post[]; count: number }> {
    const { results, count } = await this.postsSearchService.search(text, offset, limit, startId)
    const ids = results.map((result) => result.id)
    if (!ids.length) {
      return {
        items: [],
        count,
      }
    }
    const items = await this.postRepository.find({
      where: { id: In(ids) },
    })

    return {
      items,
      count,
    }
  }
}
