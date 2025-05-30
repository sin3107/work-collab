import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HttpExceptionErrorResponseDto {
  @ApiProperty({
    description: '상태코드 (HTTP Status)',
    example: 400,
  })
  @Expose()
  statusCode: number;

  @ApiProperty({ example: 'BadRequestException', description: '에러 타입' })
  @Expose()
  error: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '잘못된 요청입니다.',
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: '비즈니스 에러코드 (널값 가능)',
    nullable: true,
    example: 'Auth-E001',
  })
  @Expose()
  code?: string;
}
