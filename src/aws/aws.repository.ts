import { EntityRepository, QueryRunner, Repository } from 'typeorm'
import PublicFile from './public-file.entity'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(PublicFile)
export class AwsRepository extends Repository<PublicFile> {
  private bucket = 'somebucketname1'
  private getS3Instance() {
    return new S3({
      accessKeyId: 'minio',
      secretAccessKey: 'minio123',
      endpoint: 'http://127.0.0.1:9000',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    })
  }

  async uploadPublicFile(data: Buffer, filename: string): Promise<PublicFile> {
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
      url: uploadedResult.Location,
    })

    return this.save(newFile)
  }

  async deletePublicFile(fileId: number): Promise<void> {
    const file = await this.findOne({ id: fileId })
    if (!file) throw new NotFoundException(`File with ID: ${fileId} not found`)

    const s3 = this.getS3Instance()
    await s3
      .deleteObject({
        Bucket: this.bucket,
        Key: file.key,
      })
      .promise()

    await this.delete(fileId)
  }

  async deletePublicFileWithQueryRunner(fileId: number, queryRunner: QueryRunner): Promise<void> {
    const file = await queryRunner.manager.findOne(PublicFile, { id: fileId })
    const s3 = this.getS3Instance()
    await s3
      .deleteObject({
        Bucket: this.bucket,
        Key: file.key,
      })
      .promise()
    await queryRunner.manager.delete(PublicFile, fileId)
  }
}
