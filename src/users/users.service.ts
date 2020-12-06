import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import CreateUserDto from './dto/create-user.dto'
import User from './entities/user.entity'
import { AwsService } from '../aws/aws.service'
import PublicFile from '../aws/public-file.entity'
import { PrivateAwsService } from '../private-aws/private-aws.service'
import PrivateFile from '../private-aws/private-file.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly awsService: AwsService,
    private readonly privateAwsService: PrivateAwsService,
  ) {}

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

  async uploadPrivateFile(userId: number, imageBuffer: Buffer, filename: string): Promise<PrivateFile> {
    return this.privateAwsService.uploadPrivateFile(imageBuffer, userId, filename)
  }

  async getPrivateFile(userId: number, fileId: number): Promise<Record<string, any>> {
    const file = await this.privateAwsService.getPrivateFile(fileId)
    if (file.info.owner.id === userId) {
      throw new UnauthorizedException()
    }
    return file
  }

  async getAllPrivateFiles(userId: number): Promise<Record<string, any>> {
    const userWithFiles = await this.usersRepository.getByIdWithFiles(userId)
    if (!userWithFiles) throw new NotFoundException({ message: `User with ID "${userId}" not found` })
    return Promise.all(
      userWithFiles.files.map(async (file) => {
        const url = await this.privateAwsService.generatePreassignedUrl(file.key)
        return {
          ...file,
          url,
        }
      }),
    )
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    })
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    const user = await this.getById(userId)

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)

    if (isRefreshTokenMatching) {
      return user
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    })
  }
}
