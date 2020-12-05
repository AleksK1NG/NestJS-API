import { Module } from '@nestjs/common'
import { AwsService } from './aws.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwsRepository } from './aws.repository'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([AwsRepository]), ConfigModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
