import { IsEnum, IsNumber } from 'class-validator';
import { TeamRole } from '@common';

export class ChangeRoleRequestDTO {
    @IsNumber()
    userId: number;

    @IsEnum(TeamRole)
    role: TeamRole;
}
