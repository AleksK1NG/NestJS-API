import { Injectable } from '@nestjs/common'
import { PrivateAwsRepository } from './private-aws.repository'
import PrivateFile from './private-file.entity'

@Injectable()
export class PrivateAwsService {
  constructor(private readonly privateAwsRepository: PrivateAwsRepository) {}

  async uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string): Promise<PrivateFile> {
    return this.privateAwsRepository.uploadPrivateFile(ownerId, dataBuffer, filename)
  }

  async getPrivateFile(fileId: number): Promise<Record<string, any>> {
    console.log(111)
    return this.privateAwsRepository.getPrivateFile(fileId)
  }

  async generatePreassignedUrl(key: string): Promise<string> {
    return this.privateAwsRepository.generatePreassignedUrl(key)
  }
}
