import { Injectable } from '@nestjs/common'
import { AwsRepository } from './aws.repository'
import { ConfigService } from '@nestjs/config'
import PublicFile from './public-file.entity'

@Injectable()
export class AwsService {
  private readonly awsS3Options = {}

  constructor(private readonly awsRepository: AwsRepository, private readonly configService: ConfigService) {
    this.awsS3Options = {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      endpoint: configService.get('AWS_ENDPOINT'),
      s3ForcePathStyle: configService.get('AWS_S3_FORCE_PATH_STYLE'),
      signatureVersion: configService.get('AWS_SIGNATURE_VERSION'),
    }
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.awsRepository.uploadPublicFile(dataBuffer, filename, bucket, this.awsS3Options)
  }

  async deletePublicFile(fileId: number): Promise<void> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return this.awsRepository.deletePublicFile(fileId, bucket, this.awsS3Options)
  }
}
