import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDTO {
  @ApiProperty({ example: 'example.png', description: '저장된 파일명' })
  filename: string;

  @ApiProperty({ example: 'image/png', description: 'MIME 타입' })
  mimetype: string;

  @ApiProperty({ example: 204800, description: '파일 크기 (bytes)' })
  size: number;

  @ApiProperty({
    example: '/uploads/example.png',
    description: '클라이언트가 접근 가능한 파일 경로 또는 URL',
  })
  url: string;
}
