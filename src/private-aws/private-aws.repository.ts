import { EntityRepository, Repository } from 'typeorm'
import PrivateFile from './private-file.entity'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@EntityRepository(PrivateFile)
export class PrivateAwsRepository extends Repository<PrivateFile> {
  constructor(private readonly configService: ConfigService) {
    super()
  }
  private getS3Instance() {
    return new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      endpoint: this.configService.get('AWS_ENDPOINT'),
      s3ForcePathStyle: this.configService.get('AWS_S3_FORCE_PATH_STYLE'),
      signatureVersion: this.configService.get('AWS_SIGNATURE_VERSION'),
    })
  }

  async uploadPrivateFile(ownerId: number, data: Buffer, filename: string): Promise<PrivateFile> {
    const s3 = this.getS3Instance()
    const bucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    const uploadedResult = await s3
      .upload({
        Bucket: bucketName,
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
    const bucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    const fileInfo = await this.findOne({ id: fileId }, { relations: ['owner'] })
    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: bucketName,
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
    const bucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME')
    return s3.getSignedUrlPromise('getObject', {
      Bucket: bucketName,
      Key: key,
    })
  }
}
