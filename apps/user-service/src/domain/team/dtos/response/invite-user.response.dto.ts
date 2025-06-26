import { ApiProperty } from '@nestjs/swagger';
import { TeamRole } from '@common';

export class InviteUserResponseDTO {
  @ApiProperty({ example: 1 })
  teamId: number;

  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ enum: TeamRole, example: TeamRole.Member })
  role: TeamRole;
}
