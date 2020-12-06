import { EntityRepository, Repository } from 'typeorm'
import PrivateFile from './private-file.entity'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(PrivateFile)
export class PrivateAwsRepository extends Repository<PrivateFile> {
  async uploadPrivateFile(
    ownerId: number,
    data: Buffer,
    filename: string,
    bucket: string,
    options: S3.Types.ClientConfiguration,
  ): Promise<PrivateFile> {
    const s3 = new S3(options)
    const uploadedResult = await s3
      .upload({
        Bucket: bucket,
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

  async getPrivateFile(
    fileId: number,
    bucket: string,
    options: S3.Types.ClientConfiguration,
  ): Promise<Record<string, any>> {
    const s3 = new S3(options)

    const fileInfo = await this.findOne({ id: fileId }, { relations: ['owner'] })
    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: bucket,
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

  async generatePreassignedUrl(key: string, bucket: string, options: S3.Types.ClientConfiguration): Promise<string> {
    const s3 = new S3(options)
    return s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
    })
  }
}
