import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamVisibility } from '@common';

export class CreateTeamRequestDTO {
  @ApiProperty({ example: '개발팀' })
  name: string;

  @ApiPropertyOptional({ example: '프로젝트 설명입니다.' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/.../team-logo.png' })
  imageUrl?: string;

  @ApiPropertyOptional({ enum: TeamVisibility, example: TeamVisibility.Private })
  visibility?: TeamVisibility;
}
