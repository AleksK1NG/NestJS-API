import { EntityRepository, Repository } from 'typeorm'
import Post from './post.entity'
import CreatePostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'
import PostNotFoundException from './exceptions/postNotFound.exception'

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async getAllPosts(): Promise<Post[]> {
    return this.find()
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.findOne({ id })
    if (!post) throw new PostNotFoundException(id)
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

  async updatePost(updatePostDto: UpdatePostDto): Promise<Post> {
    const { id, ...rest } = updatePostDto
    const updatedPost = await this.preload({
      id,
      ...rest,
    })
    if (!updatedPost) throw new PostNotFoundException(id)
    return updatedPost
  }

  async deletePost(id: number): Promise<void> {
    const result = await this.delete({ id })
    if (result.affected === 0) throw new PostNotFoundException(id)
  }
}
