import { Module } from '@nestjs/common'
import { PrivateAwsService } from './private-aws.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PrivateAwsRepository } from './private-aws.repository'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([PrivateAwsRepository]), ConfigModule],
  providers: [PrivateAwsService],
  exports: [PrivateAwsService],
})
export class PrivateAwsModule {}
