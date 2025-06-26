import { TeamRole } from "@common";
import { ApiProperty } from "@nestjs/swagger";

export class TeamMemberResponseDTO {
    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: '홍길동' })
    name: string;

    @ApiProperty({ example: 'hong@example.com' })
    email: string;

    @ApiProperty({ enum: TeamRole })
    role: TeamRole;

    @ApiProperty({ example: 2, nullable: true })
    invitedBy?: number;

    @ApiProperty({ example: '2025-06-20T13:45:00.000Z' })
    joinedAt: Date;
}

export class TeamMemberListResponseDTO {
    @ApiProperty({ type: [TeamMemberResponseDTO] })
    members: TeamMemberResponseDTO[];
}