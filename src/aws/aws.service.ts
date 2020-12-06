import { Injectable } from '@nestjs/common'
import { AwsRepository } from './aws.repository'
import PublicFile from './public-file.entity'
import { QueryRunner } from 'typeorm'

@Injectable()
export class AwsService {
  constructor(private readonly awsRepository: AwsRepository) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
    return this.awsRepository.uploadPublicFile(dataBuffer, filename)
  }

  async deletePublicFile(fileId: number): Promise<void> {
    return this.awsRepository.deletePublicFile(fileId)
  }

  async deletePublicFileWithQueryRunner(fileId: number, queryRunner: QueryRunner): Promise<void> {
    return this.awsRepository.deletePublicFileWithQueryRunner(fileId, queryRunner)
  }
}
