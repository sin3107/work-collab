import { ApiProperty } from '@nestjs/swagger';
import { TeamRole, TeamVisibility } from '@common';

export class TeamItemResponseDTO {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '팀명' })
    name: string;

    @ApiProperty({ example: '설명글' })
    description: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/.../team-logo.png', nullable: true })
    imageUrl?: string;

    @ApiProperty({ enum: TeamVisibility, example: TeamVisibility.Private })
    visibility: TeamVisibility;

    @ApiProperty({ example: 5 })
    createdBy: number;

    @ApiProperty({ example: '2025-06-20T10:23:45.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-06-20T10:23:45.000Z' })
    updatedAt: Date;
}

export class TeamListResponseDTO {
    @ApiProperty({ type: [TeamItemResponseDTO] })
    teams: TeamItemResponseDTO[];
}