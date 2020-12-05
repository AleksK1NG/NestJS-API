import { Module } from '@nestjs/common'
import { AwsService } from './aws.service'

@Module({
  providers: [AwsService],
})
export class AwsModule {}
