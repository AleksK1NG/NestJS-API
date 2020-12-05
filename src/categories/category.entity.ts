import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import Post from '../posts/post.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[]
}
