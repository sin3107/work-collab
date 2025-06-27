import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { FileRepository, UploadedFileMeta } from '../../domain/file/file.repository';

@Injectable()
export class LocalFileAdapter implements FileRepository {
  async upload(file: Express.Multer.File): Promise<UploadedFileMeta> {
    const baseUrl = '/uploads';

    return {
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: path.join(baseUrl, file.filename).replace(/\\/g, '/'),
    };
  }

  async delete(filename: string): Promise<void> {
    const fs = await import('fs/promises');
    const filePath = path.join(process.cwd(), 'uploads', filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }
}
