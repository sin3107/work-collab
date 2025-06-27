import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';

describe('FileServiceController', () => {
  let fileServiceController: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService],
    }).compile();

    fileServiceController = app.get<FileController>(FileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileServiceController.getHello()).toBe('Hello World!');
    });
  });
});
