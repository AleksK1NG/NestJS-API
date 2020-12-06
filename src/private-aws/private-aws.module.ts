import { Module } from '@nestjs/common'
import { PrivateAwsService } from './private-aws.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PrivateAwsRepository } from './private-aws.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([PrivateAwsRepository]), ConfigModule],
  providers: [PrivateAwsService, PrivateAwsRepository, ConfigService],
  exports: [PrivateAwsService],
})
export class PrivateAwsModule {}
