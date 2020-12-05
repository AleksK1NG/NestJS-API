import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import RegisterDto from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import PostgresErrorCode from '../database/postgresErrorCode.enum'
import User from '../users/user.entity'
import TokenPayload from './interfaces/tokenPayload.interface'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    try {
      const createdUser = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
      })
      createdUser.password = undefined

      return createdUser
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST)
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  getCookieWithJwtToken(userId: number): string {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`
  }

  getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string): Promise<User> {
    try {
      const user = await this.usersService.getByEmail(email)
      await this.verifyPassword(plainTextPassword, user.password)
      return user
    } catch (e) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isValid = await bcrypt.compare(plainTextPassword, hashedPassword)
    if (!isValid) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
  }
}
