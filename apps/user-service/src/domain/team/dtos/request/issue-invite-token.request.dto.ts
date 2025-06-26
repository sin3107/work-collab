import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';

export class IssueInviteTokenRequestDTO {
  @ApiPropertyOptional({
    description: '토큰 만료 시간 (시간 단위). 미지정 시 무기한',
    example: 24,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInHours?: number;
}
