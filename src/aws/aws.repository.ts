import { EntityRepository, Repository } from 'typeorm'
import PublicFile from './public-file.entity'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(PublicFile)
export class AwsRepository extends Repository<PublicFile> {
  async uploadPublicFile(dataBuffer: Buffer, filename: string, bucket: string): Promise<PublicFile> {
    const s3 = new S3()
    const uploadedResult = await s3
      .upload({
        Bucket: bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise()

    const newFile = this.create({
      key: uploadedResult.Key,
      url: uploadedResult.Location,
    })

    return this.save(newFile)
  }

  async deletePublicFile(fileId: number, bucket: string) {
    const file = await this.findOne({ id: fileId })
    if (!file) throw new NotFoundException(`File with ID: ${fileId} not found`)

    const s3 = new S3()
    await s3
      .deleteObject({
        Bucket: bucket,
        Key: file.key,
      })
      .promise()

    await this.delete(fileId)
  }
}
