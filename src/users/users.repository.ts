import { EntityRepository, Repository } from 'typeorm'
import User from './entities/user.entity'
import CreateUserDto from './dto/create-user.dto'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create({ ...createUserDto })
    return this.save(user)
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email })
    if (!user) throw new NotFoundException({ message: `Post with email "${email}" not found` })
    return user
  }

  async getById(id: number): Promise<User> {
    const user = await this.findOne({ id })
    if (!user) throw new NotFoundException({ message: `Post with ID "${id}" not found` })
    return user
  }
}
