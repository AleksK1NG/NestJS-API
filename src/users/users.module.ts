import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersRepository } from './users.repository'
import { UsersController } from './users.controller'
import { AwsModule } from '../aws/aws.module'
import { PrivateAwsModule } from '../private-aws/private-aws.module'

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), AwsModule, PrivateAwsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
