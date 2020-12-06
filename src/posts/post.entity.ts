import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '../users/entities/user.entity'
import { Category } from '../categories/category.entity'

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number

  @Column()
  public title: string

  @Column()
  public content: string

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[]

  @Column('text', { array: true })
  public paragraphs: string[]
}

export default Post
