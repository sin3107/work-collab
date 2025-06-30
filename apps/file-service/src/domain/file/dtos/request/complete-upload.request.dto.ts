import { ApiProperty } from '@nestjs/swagger';

export class CompleteUploadRequestDTO {
  @ApiProperty({ example: 'profile/abc-uuid.png', description: 'S3에 저장된 파일 이름(Key)' })
  filename: string;

  @ApiProperty({ example: 'image/png', description: '파일 MIME 타입' })
  mimetype: string;

  @ApiProperty({ example: 204800, description: '파일 크기 (bytes)' })
  size: number;
}
