import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import CreateUserDto from './dto/create-user.dto'
import User from './user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto)
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository.getByEmail(email)
  }

  async getById(id: number): Promise<User> {
    return this.usersRepository.getById(id)
  }
}
