import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './file.repository';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { LocalFileAdapter } from '../../infra/file/local-file.adapter';
// import { S3FileAdapter } from '../../infra/file/s3-file.adapter';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한
      }
    })
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: FileRepository,
      useClass: LocalFileAdapter,
      // useClass: S3FileAdapter,
    },
  ],
})
export class FileModule {}
