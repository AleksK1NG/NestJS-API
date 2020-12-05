import { EntityRepository, Repository } from 'typeorm'
import Post from './post.entity'

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async getAllPosts(): Promise<Post[]> {
    const posts = await this.find()
    return posts
  }
}
