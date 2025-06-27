import { Injectable } from '@nestjs/common';
import { FileRepository, UploadedFileMeta } from './file.repository';
import { FileErrors } from '@error/constants/file.errors';
import { ErrorService } from '@error';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { PresignUploadUrlResponseDTO } from './dtos/response/presign-url.response.dto';
import { FileType } from '@common';

@Injectable()
export class FileService {
  constructor(
    private readonly errorService: ErrorService,
    private readonly fileRepository: FileRepository
  ) { }

  async upload(file: Express.Multer.File): Promise<UploadedFileMeta> {
    return this.fileRepository.upload(file);
  }

  async delete(filename: string): Promise<void> {
    const filePath = path.join(process.cwd(), 'uploads', filename);

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.errorService.throw(FileErrors.FILE_NOT_FOUND);
      }
      throw err;
    }
  }

  getFilePath(filename: string): string {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      this.errorService.throw(FileErrors.FILE_NOT_FOUND);
    }
    return filePath;
  }

  getPresignedUploadUrl(type: FileType, ext: string): PresignUploadUrlResponseDTO {
    const supportedExts = ['png', 'jpg', 'jpeg', 'pdf'];
    if (!supportedExts.includes(ext.toLowerCase())) {
      this.errorService.throw(FileErrors.INVALID_FILE_TYPE);
    }

    const filename = `${type}/${randomUUID()}.${ext}`;
    const url = `/uploads/${filename}`;

    return { filename, url };

    // return this.fileRepository.getPresignedUploadUrl(type, ext);
  }

}
