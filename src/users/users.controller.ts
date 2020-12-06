import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import RequestWithUser from '../auth/interfaces/requestWithUser.interface'
import { Response } from 'express'

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Record<string, any>) {
    return this.usersService.uploadAvatar(req.user.id, file.buffer, file.originalname)
  }

  @Delete('avatar')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Req() req: RequestWithUser) {
    return this.usersService.deleteAvatar(req.user.id)
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivateFiles(@Req() req: RequestWithUser) {
    return this.usersService.getAllPrivateFiles(req.user.id)
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(@Req() req: RequestWithUser, @UploadedFile() file: Record<string, any>) {
    return this.usersService.uploadPrivateFile(req.user.id, file.buffer, file.req.user.id)
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const file = await this.usersService.getPrivateFile(req.user.id, id)
    file.stream.pipe(res)
  }
}
