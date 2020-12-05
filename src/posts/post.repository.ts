import { EntityRepository, Repository } from 'typeorm'
import Post from './post.entity'
import CreatePostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async getAllPosts(): Promise<Post[]> {
    return this.find()
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.findOne({ id })
    if (!post) throw new NotFoundException({ message: `Post with ID "${id}" not found` })
    return post
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content } = createPostDto
    const post = this.create({
      title,
      content,
    })
    return this.save(post)
  }

  async updatePost(updatePostDto: UpdatePostDto) {
    const { id, ...rest } = updatePostDto
    const updatedPost = await this.update({ id }, { ...rest })
    console.log('updatedPost ', updatedPost)
    return updatedPost
  }

  async deletePost(id: number): Promise<void> {
    const result = await this.delete({ id })
    if (result.affected === 0) throw new NotFoundException({ message: `Post with ID "${id}" not found` })
  }
}
