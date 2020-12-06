import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import Address from './address.entity'
import Post from '../../posts/post.entity'
import PublicFile from '../../aws/public-file.entity'
import PrivateFile from '../../private-aws/private-file.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number

  @Column({ unique: true })
  public email: string

  @Column()
  public name: string

  @Column()
  @Exclude()
  public password: string

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[]

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[]

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string
}

export default User
