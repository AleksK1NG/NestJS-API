import { Injectable } from '@nestjs/common'
import { AwsRepository } from './aws.repository'
import { ConfigService } from '@nestjs/config'
import PublicFile from './public-file.entity'

@Injectable()
export class AwsService {
  constructor(private readonly awsRepository: AwsRepository, private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
    return this.awsRepository.uploadPublicFile(dataBuffer, filename)
  }

  async deletePublicFile(fileId: number): Promise<void> {
    return this.awsRepository.deletePublicFile(fileId)
  }
}
