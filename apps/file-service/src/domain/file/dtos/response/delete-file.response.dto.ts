import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResponseDTO {
  @ApiProperty({ example: 'example.png', description: '삭제된 파일명' })
  filename: string;
}