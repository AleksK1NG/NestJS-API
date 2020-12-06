import { Injectable } from '@nestjs/common'
import { PrivateAwsRepository } from './private-aws.repository'
import { ConfigService } from '@nestjs/config'
import PrivateFile from './private-file.entity'

@Injectable()
export class PrivateAwsService {
  private readonly awsS3Options = {}
  constructor(
    private readonly privateAwsRepository: PrivateAwsRepository,
    private readonly configService: ConfigService,
  ) {
    this.awsS3Options = {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      endpoint: configService.get('AWS_ENDPOINT'),
      s3ForcePathStyle: configService.get('AWS_S3_FORCE_PATH_STYLE'),
      signatureVersion: configService.get('AWS_SIGNATURE_VERSION'),
    }
  }

  async uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string): Promise<PrivateFile> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.privateAwsRepository.uploadPrivateFile(ownerId, dataBuffer, filename, bucket, this.awsS3Options)
  }

  async getPrivateFile(fileId: number): Promise<Record<string, any>> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.privateAwsRepository.getPrivateFile(fileId, bucket, this.awsS3Options)
  }

  async generatePreassignedUrl(key: string): Promise<string> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.privateAwsRepository.generatePreassignedUrl(key, bucket, this.awsS3Options)
  }
}
