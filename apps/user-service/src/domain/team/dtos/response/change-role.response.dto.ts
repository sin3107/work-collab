import { TeamRole } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleResponseDTO {
    @ApiProperty({ example: 1 })
    teamId: number;

    @ApiProperty({ example: 12 })
    userId: number;

    @ApiProperty({ enum: TeamRole, example: TeamRole.Member })
    role: TeamRole;
}