import { TeamVisibility } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ResolveInviteTokenResponseDTO {

  @ApiProperty({ example: 1, description: '팀 ID' })
  teamId: number;

  @ApiProperty({ example: '디자인팀', description: '팀 이름' })
  teamName: string;

  @ApiProperty({
    example: '팀 소개 문구입니다.',
    nullable: true,
    description: '팀 설명',
  })
  description: string | null;

  @ApiProperty({
    example: 'https://example.com/team-image.jpg',
    nullable: true,
    description: '팀 대표 이미지 URL',
  })
  imageUrl: string | null;

  @ApiProperty({ enum: TeamVisibility, example: TeamVisibility.Private })
  visibility: TeamVisibility;
}
