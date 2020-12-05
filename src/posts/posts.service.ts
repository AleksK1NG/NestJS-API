import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import UpdatePostDto from './dto/updatePost.dto'
import CreatePostDto from './dto/createPost.dto'
import { PostRepository } from './post.repository'
import Post from './post.entity'
import { UpdateResult } from 'typeorm'

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.getAllPosts()
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.getPostById(id)
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepository.createPost(createPostDto)
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postRepository.updatePost(updatePostDto)
  }

  async deletePost(id: number): Promise<void> {
    return this.postRepository.deletePost(id)
  }
}
