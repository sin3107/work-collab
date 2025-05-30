import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type as transformerType } from 'class-transformer';

import { EnumToArray } from '@common/utils/enum.util';

export class ErrorCommonResponse<T> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: '상태코드' })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({ type: Boolean, description: '성공여부' })
  @Expose()
  readonly success: boolean;

  @ApiProperty({ type: String, description: '에러 발생시간' })
  @Expose()
  readonly timestamp: Date;

  @ApiProperty({ type: String, description: '에러 발생 url' })
  @Expose()
  readonly path: string;

  @ApiProperty({ type: String, description: '에러 발생 메소드' })
  @Expose()
  readonly method: string;

  @ApiProperty({
    type: 'object',
    description: 'HttpExceptionErrorResponseDto 또는 ValidationErrorResponseDto 중 하나가 올 수 있습니다.',
    additionalProperties: true,
  })
  @Expose()
  error: Record<string, any>;
}