import { Injectable } from '@nestjs/common'
import UpdatePostDto from './dto/updatePost.dto'
import CreatePostDto from './dto/createPost.dto'
import { PostRepository } from './post.repository'
import Post from './post.entity'
import User from '../users/entities/user.entity'
import { PostsSearchService } from './postsSearch.service'

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postsSearchService: PostsSearchService,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.getAllPosts()
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
}
