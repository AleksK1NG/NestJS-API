import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import User from '../users/user.entity'
import RequestWithUser from './interfaces/requestWithUser.interface'
import { Response } from 'express'
import { LocalAuthenticationGuard } from './guards/local-authentication.guard'
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard'

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
  async login(@Req() req: RequestWithUser, @Res() res: Response): Promise<User> {
    const { user } = req
    const cookie = this.authService.getCookieWithJwtToken(user.id)
    res.setHeader('Set-Cookie', cookie)
    user.password = undefined
    return user
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Res() res: Response): Promise<Response> {
    const cookie = this.authService.getCookieForLogOut()
    res.setHeader('Set-Cookie', cookie)
    return res.sendStatus(200)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  async authenticate(@Req() req: RequestWithUser): Promise<User> {
    const user = req.user
    user.password = undefined
    return user
  }
}
