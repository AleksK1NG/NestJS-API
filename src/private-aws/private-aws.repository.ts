import { EntityRepository, Repository } from 'typeorm'
import PrivateFile from './private-file.entity'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(PrivateFile)
export class PrivateAwsRepository extends Repository<PrivateFile> {
  private bucket = 'private-bucket'
  private getS3Instance() {
    return new S3({
      accessKeyId: 'minio',
      secretAccessKey: 'minio123',
      endpoint: 'http://127.0.0.1:9000',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    })
  }

  async uploadPrivateFile(ownerId: number, data: Buffer, filename: string): Promise<PrivateFile> {
    const s3 = this.getS3Instance()
    const uploadedResult = await s3
      .upload({
        Bucket: this.bucket,
        Body: data,
        Key: `${uuid()}-${filename}`,
      })
      .promise()

    const newFile = this.create({
      key: uploadedResult.Key,
      owner: {
        id: ownerId,
      },
    })

    return this.save(newFile)
  }

  async getPrivateFile(fileId: number): Promise<Record<string, any>> {
    const s3 = this.getS3Instance()
    const fileInfo = await this.findOne({ id: fileId }, { relations: ['owner'] })
    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.bucket,
          Key: fileInfo.key,
        })
        .createReadStream()
      return {
        stream,
        info: fileInfo,
      }
    }
    throw new NotFoundException(`File with id ${fileId} not found`)
  }

  async generatePreassignedUrl(key: string): Promise<string> {
    const s3 = this.getS3Instance()
    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
    })
  }
}
