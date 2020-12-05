import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import User from '../users/user.entity'
import RequestWithUser from './interfaces/requestWithUser.interface'
import { LocalAuthenticationGuard } from './guards/local-authentication.guard'
import JwtAuthenticationGuard from './guards/jwt-authentication.guard'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<User> {
    const { user } = req
    const cookie = this.authService.getCookieWithJwtToken(user.id)
    req.res.setHeader('Set-Cookie', cookie)
    return user
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser): Promise<void> {
    const cookie = this.authService.getCookieForLogOut()
    req.res.setHeader('Set-Cookie', cookie)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  async authenticate(@Req() req: RequestWithUser): Promise<User> {
    return req.user
  }
}
