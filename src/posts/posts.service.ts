import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import UpdatePostDto from './dto/updatePost.dto'
import CreatePostDto from './dto/createPost.dto'
import { PostRepository } from './post.repository'
import Post from './post.entity'

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.getAllPosts()
  }

  // getPostById(id: number) {
  //   const post = this.posts.find((post) => post.id === id)
  //   if (post) return post
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
  // }
  //
  // createPost(post: CreatePostDto) {
  //   const newPost = {
  //     id: ++this.lastPostId,
  //     ...post,
  //   }
  //   this.posts.push(newPost)
  //   return newPost
  // }
  //
  // replacePost(id: number, post: UpdatePostDto) {
  //   const postIndex = this.posts.findIndex((post) => post.id === id)
  //   if (postIndex > -1) {
  //     this.posts[postIndex] = post
  //     return post
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
  // }
  //
  // deletePost(id: number) {
  //   const postIndex = this.posts.findIndex((post) => post.id === id)
  //   if (postIndex > -1) {
  //     this.posts.splice(postIndex, 1)
  //   } else {
  //     throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
  //   }
  // }
}
