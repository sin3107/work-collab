import { Injectable } from '@nestjs/common';
import { FileRepository, UploadedFileMeta } from '../../domain/file/file.repository';
import { Express } from 'express';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import mime from 'mime-types';
import { PresignUploadUrlResponseDTO } from '../../domain/file/dtos/response/presign-url.response.dto';

@Injectable()
export class S3FileAdapter implements FileRepository {
  private readonly s3: S3;
  private readonly bucket: string;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = process.env.S3_BUCKET!;
  }

  async upload(file: Express.Multer.File): Promise<UploadedFileMeta> {
    const key = `${uuidv4()}_${file.originalname}`;
    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return {
      filename: key,
      mimetype: file.mimetype,
      size: file.size,
      url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }

  async delete(filename: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: filename,
      })
      .promise();
  }

  async getPresignedUploadUrl(
    type: string,
    ext: string,
  ): Promise<PresignUploadUrlResponseDTO> {
    const filename = `${type}/${uuidv4()}.${ext}`;
    const contentType = mime.lookup(ext) || 'application/octet-stream';

    const url = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucket,
      Key: filename,
      Expires: 60,
      ContentType: contentType,
      ACL: 'public-read',
    });

    return { filename, url };
  }

}
