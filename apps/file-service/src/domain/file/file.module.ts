import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './file.repository';
import { LocalFileAdapter } from '../../infra/file/local-file.adapter';

@Module({
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
