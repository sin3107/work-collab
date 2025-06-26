import { ApiProperty } from '@nestjs/swagger';
import { TeamVisibility } from '@common';

export class CreateTeamResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '프로젝트 A팀' })
  name: string;

  @ApiProperty({ example: '팀 설명입니다.' })
  description?: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/.../team-logo.png' })
  imageUrl?: string;

  @ApiProperty({ enum: TeamVisibility, example: TeamVisibility.Private })
  visibility: TeamVisibility;

  @ApiProperty({ example: 10 })
  createdBy: number;
}
