import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '../users/entities/user.entity'

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number

  @Column()
  public title: string

  @Column()
  public content: string

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User
}

export default Post
