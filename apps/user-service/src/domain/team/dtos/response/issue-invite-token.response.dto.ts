import { ApiProperty } from '@nestjs/swagger';

export class IssueInviteTokenResponseDTO {
  @ApiProperty({
    example: '3c1d1ecf-9399-4c3f-9e6b-1cfc5adf8432',
    description: '초대 토큰 값 (UUID)',
  })
  token: string;

  @ApiProperty({
    example: '2025-07-01T10:00:00.000Z',
    nullable: true,
    description: '만료 시각 (없으면 무기한 유효)',
  })
  expiresAt: Date | null;
}