import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import RequestWithUser from '../auth/interfaces/requestWithUser.interface'

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor)
  async uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: any) {
    return 1
  }


}
