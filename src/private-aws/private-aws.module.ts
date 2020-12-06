import { Module } from '@nestjs/common';
import { PrivateAwsService } from './private-aws.service';

@Module({
  providers: [PrivateAwsService]
})
export class PrivateAwsModule {}
