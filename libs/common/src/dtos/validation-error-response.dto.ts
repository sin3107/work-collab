import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'ValidationException' })
  error: string;

  @ApiProperty({
    example: {
      email: ['이메일 형식이 잘못되었습니다.'],
    },
  })
  message: Record<string, string[]>;

  constructor(message: Record<string, string[]>) {
    this.statusCode = 400;
    this.error = 'ValidationException';
    this.message = message;
  }
}