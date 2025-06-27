import { ApiProperty } from '@nestjs/swagger';

export class PresignUploadUrlResponseDTO {
  @ApiProperty({ example: 'profile/abcd1234.png', description: '업로드할 파일 경로(서버가 지정)' })
  filename: string;

  @ApiProperty({ example: '/uploads/profile/abcd1234.png', description: '업로드 대상 URL' })
  url: string;
}
