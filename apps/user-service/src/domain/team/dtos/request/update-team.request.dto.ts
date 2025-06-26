import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamVisibility } from '@common';

export class UpdateTeamRequestDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(TeamVisibility)
    visibility?: TeamVisibility;
}
