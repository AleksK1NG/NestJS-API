import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import User from '../users/entities/user.entity'
import RequestWithUser from './interfaces/requestWithUser.interface'
import { LocalAuthenticationGuard } from './guards/local-authentication.guard'
import JwtAuthenticationGuard from './guards/jwt-authentication.guard'
import JwtRefreshGuard from './guards/jwt-refresh.guard'
import { UsersService } from '../users/users.service'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<User> {
    const { user } = req
    const accessTokenCookie = await this.authService.getCookieWithJwtAccessToken(user.id)

    const { cookie: refreshTokenCookie, token: refreshToken } = await this.authService.getCookieWithJwtRefreshToken(
      user.id,
    )

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id)
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
    return user
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser): Promise<void> {
    await this.usersService.removeRefreshToken(req.user.id)
    const cookie = this.authService.getCookieForLogOut()
    req.res.setHeader('Set-Cookie', cookie)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  async authenticate(@Req() req: RequestWithUser): Promise<User> {
    return req.user
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: RequestWithUser) {
    const accessTokenCookie = await this.authService.getCookieWithJwtAccessToken(req.user.id)
    req.res.setHeader('Set-Cookie', accessTokenCookie)
    return req.user
  }
}
