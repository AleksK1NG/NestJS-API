import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import CreateUserDto from './dto/create-user.dto'
import User from './entities/user.entity'
import { AwsService } from '../aws/aws.service'
import PublicFile from '../aws/public-file.entity'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository, private readonly awsService: AwsService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto)
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository.getByEmail(email)
  }

  async getById(id: number): Promise<User> {
    return this.usersRepository.getById(id)
  }

  async uploadAvatar(userId: number, imageBuffer: Buffer, filename: string): Promise<PublicFile> {
    const user = await this.getById(userId)
    if (user.avatar) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      })
      await this.awsService.deletePublicFile(user.avatar.id)
    }

    const avatar = await this.awsService.uploadPublicFile(imageBuffer, filename)

    await this.usersRepository.update(userId, {
      ...user,
      avatar,
    })
    return avatar
  }

  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.getById(userId)
    const fileId = user.avatar?.id
    if (fileId) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      })
      await this.awsService.deletePublicFile(fileId)
    }
  }
}
