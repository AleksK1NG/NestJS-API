import { Injectable } from '@nestjs/common'
import { AwsRepository } from './aws.repository'
import { ConfigService } from '@nestjs/config'
import PublicFile from './public-file.entity'

@Injectable()
export class AwsService {
  constructor(private readonly awsRepository: AwsRepository, private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.awsRepository.uploadPublicFile(dataBuffer, filename, bucket)
  }

  async deletePublicFile(fileId: number): Promise<void> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.awsRepository.deletePublicFile(fileId, bucket)
  }
}
