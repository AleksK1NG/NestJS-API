import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '../users/entities/user.entity'

@Entity()
class PrivateFile {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public key: string

  @ManyToOne(() => User, (owner: User) => owner.files)
  public owner?: User
}

export default PrivateFile
