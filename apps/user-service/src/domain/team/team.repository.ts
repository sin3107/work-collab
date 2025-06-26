import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { UserTeamEntity } from './entities/user-team.entity';
import { TeamRole } from '@common';
import { CreateTeamRequestDTO } from './dtos/request/create-team.request.dto';
import { TeamInviteTokenEntity } from './entities/team-invite-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TeamRepository {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>,
        @InjectRepository(UserTeamEntity)
        private readonly userTeamRepository: Repository<UserTeamEntity>,
        @InjectRepository(TeamInviteTokenEntity)
        private readonly tokenRepository: Repository<TeamInviteTokenEntity>,
    ) { }

    async createTeam(dto: CreateTeamRequestDTO, createdBy: number): Promise<TeamEntity> {
        const entity = this.teamRepository.create({ ...dto, createdBy });
        return await this.teamRepository.save(entity);
    }

    async findById(teamId: number): Promise<TeamEntity | null> {
        return await this.teamRepository.findOne({ where: { id: teamId } });
    }

    async updateTeam(teamId: number, dto: Partial<TeamEntity>): Promise<TeamEntity> {
        await this.teamRepository.update(teamId, dto);
        return await this.findById(teamId);
    }

    async deleteTeam(teamId: number): Promise<void> {
        await this.teamRepository.softDelete({ id: teamId });
    }

    async findByIdWithMembers(teamId: number): Promise<TeamEntity | null> {
        return await this.teamRepository.findOne({
            where: { id: teamId },
            relations: ['members', 'members.user'],
        });
    }

    async getUserTeamRole(userId: number, teamId: number): Promise<TeamRole | null> {
        const userTeam = await this.userTeamRepository.findOne({
            where: { userId, teamId },
        });
        return userTeam?.role ?? null;
    }

    async addUserToTeam(
        teamId: number,
        userId: number,
        role: TeamRole,
        invitedBy?: number
    ): Promise<void> {
        const entity = this.userTeamRepository.create({
            teamId,
            userId,
            role,
            invitedBy,
        });
        await this.userTeamRepository.save(entity);
    }

    async getTeamsByUserId(userId: number): Promise<TeamEntity[]> {
        const userTeams = await this.userTeamRepository.find({
            where: { userId },
            relations: ['team'],
        });
        return userTeams.map(userTeam => userTeam.team);
    }

    async updateUserTeamRole(teamId: number, userId: number, role: TeamRole): Promise<void> {
        await this.userTeamRepository.update({ teamId, userId }, { role });
    }

    async removeUserFromTeam(userId: number, teamId: number): Promise<boolean> {
        const record = await this.userTeamRepository.findOne({ where: { userId, teamId } });
        if (!record) return false;

        await this.userTeamRepository.remove(record);
        return true;
    }

    async generateInviteToken(
        teamId: number,
        userId: number,
        expiresAt?: Date | null,
    ): Promise<TeamInviteTokenEntity> {
        const token = randomUUID();

        const inviteToken = this.tokenRepository.create({
            token,
            teamId,
            createdBy: userId,
            expiresAt,
        });

        return await this.tokenRepository.save(inviteToken);
    }

    async findTeamByToken(token: string): Promise<{ team: TeamEntity; token: TeamInviteTokenEntity } | null> {
        const invite = await this.tokenRepository.findOne({
            where: { token },
            relations: ['team'],
        });

        if (!invite || (invite.expiresAt && invite.expiresAt < new Date())) {
            return null;
        }

        return {
            team: invite.team,
            token: invite,
        };
    }

    async isUserInTeam(userId: number, teamId: number): Promise<boolean> {
        const existing = await this.userTeamRepository.findOne({
            where: { userId, teamId },
        });
        return !!existing;
    }

    async deleteInviteToken(token: string): Promise<boolean> {
        const result = await this.tokenRepository.delete({ token });
        return result.affected > 0;
    }
}