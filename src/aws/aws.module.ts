import { Module } from '@nestjs/common'
import { AwsService } from './aws.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwsRepository } from './aws.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([AwsRepository]), ConfigModule],
  providers: [AwsService, ConfigService],
  exports: [AwsService],
})
export class AwsModule {}
