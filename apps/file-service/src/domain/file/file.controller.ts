import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Express, Response } from 'express';
import { SuccessResponse } from '@common/decorators/success-response.decorator';
import { FileSuccess } from './response-defines/file-success';
import { ApiOperation } from '@nestjs/swagger';
import { ErrorResponse, FileType, VoidResponseDTO } from '@common';
import { FileErrors } from '@error/constants/file.errors';
import { UploadFileResponseDTO } from './dtos/response/upload-file.response.dto';
import { DeleteFileResponseDTO } from './dtos/response/delete-file.response.dto';
import { PresignUploadUrlResponseDTO } from './dtos/response/presign-url.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompleteUploadRequestDTO } from './dtos/request/complete-upload.request.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post()
  @ApiOperation({ summary: '파일 업로드' })
  @UseInterceptors(FileInterceptor('file'))
  @SuccessResponse(HttpStatus.CREATED, [FileSuccess['FILE-S001']])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [FileErrors.FILE_UPLOAD_FAILED])
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDTO> {
    return this.fileService.upload(file);
  }

  @Get(':filename')
  @ApiOperation({ summary: '파일 조회' })
  @SuccessResponse(HttpStatus.OK, [FileSuccess['FILE-S002']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [FileErrors.FILE_NOT_FOUND])
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.fileService.getFilePath(filename);
    return res.sendFile(filePath, { root: process.cwd() });
  }

  @Delete(':filename')
  @ApiOperation({ summary: '파일 삭제' })
  @SuccessResponse(HttpStatus.OK, [FileSuccess['FILE-S003']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [FileErrors.FILE_NOT_FOUND])
  async deleteFile(@Param('filename') filename: string): Promise<DeleteFileResponseDTO> {
    await this.fileService.delete(filename);
    return { filename };
  }

  @Get('presign-upload-url')
  @ApiOperation({ summary: '프론트 전용 업로드 URL 발급' })
  @SuccessResponse(HttpStatus.OK, [FileSuccess['FILE-S004']])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [FileErrors.INVALID_FILE_TYPE])
  async getPresignedUrl(
    @Query('type') type: FileType,
    @Query('ext') ext: string,
  ): Promise<PresignUploadUrlResponseDTO> {
    return this.fileService.getPresignedUploadUrl(type, ext);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Presign 업로드 완료 알림' })
  @SuccessResponse(HttpStatus.OK, [FileSuccess['FILE-S005']])
  async completeUpload(
    @Body() dto: CompleteUploadRequestDTO,
  ): Promise<VoidResponseDTO> {
    return await this.fileService.handleUploadComplete(dto);
  }
}