import { Injectable } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { CreateTeamResponseDTO } from './dtos/response/create-team.response.dto';
import { TeamRole, VoidResponseDTO } from '@common';
import { InviteUserResponseDTO } from './dtos/response/invite-user.response.dto';
import { ErrorService } from '@error';
import { TeamErrors } from '@error/constants/team.errors';
import { CreateTeamRequestDTO } from './dtos/request/create-team.request.dto';
import { TeamListResponseDTO } from './dtos/response/list-teams.response.dto';
import { TeamMemberListResponseDTO } from './dtos/response/list-team-members.response.dto';
import { ChangeRoleResponseDTO } from './dtos/response/change-role.response.dto';
import { UpdateTeamRequestDTO } from './dtos/request/update-team.request.dto';
import { UpdateTeamResponseDTO } from './dtos/response/update-team.response.dto';

@Injectable()
export class TeamService {
    constructor(

        private readonly errorService: ErrorService,
        private readonly teamRepository: TeamRepository
    ) { }

    async getMyTeams(userId: number): Promise<TeamListResponseDTO> {
        const teams = await this.teamRepository.getTeamsByUserId(userId);
        return { teams };
    }

    async createTeam(dto: CreateTeamRequestDTO, userId: number): Promise<CreateTeamResponseDTO> {
        const team = await this.teamRepository.createTeam(dto, userId);
        await this.teamRepository.addUserToTeam(userId, team.id, TeamRole.Owner);

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            imageUrl: team.imageUrl,
            visibility: team.visibility,
            createdBy: team.createdBy,
        };
    }

    async updateTeam(
        teamId: number,
        userId: number,
        dto: UpdateTeamRequestDTO
    ): Promise<UpdateTeamResponseDTO> {
        const team = await this.teamRepository.findById(teamId);
        if (!team) {
            this.errorService.throw(TeamErrors.TEAM_NOT_FOUND);
        }

        const role = await this.teamRepository.getUserTeamRole(userId, teamId);
        if (role !== TeamRole.Owner) {
            this.errorService.throw(TeamErrors.TEAM_DELETE_FORBIDDEN);
        }

        const updated = await this.teamRepository.updateTeam(teamId, dto);

        return {
            id: updated.id,
            name: updated.name,
            description: updated.description,
            imageUrl: updated.imageUrl,
            visibility: updated.visibility,
            createdBy: updated.createdBy,
        };
    }

    async deleteTeam(teamId: number, userId: number): Promise<VoidResponseDTO> {
        const role = await this.teamRepository.getUserTeamRole(userId, teamId);

        if (!role) {
            this.errorService.throw(TeamErrors.USER_NOT_IN_TEAM);
        }

        if (role !== TeamRole.Owner) {
            this.errorService.throw(TeamErrors.TEAM_DELETE_FORBIDDEN);
        }

        await this.teamRepository.deleteTeam(teamId);

        return { message: '팀이 성공적으로 삭제되었습니다.' };
    }

    async getTeamMembers(teamId: number): Promise<TeamMemberListResponseDTO> {
        const team = await this.teamRepository.findByIdWithMembers(teamId);
        if (!team) this.errorService.throw(TeamErrors.TEAM_NOT_FOUND);

        const members = team.members.map(member => ({
            userId: member.user.id,
            name: member.user.name,
            email: member.user.email,
            role: member.role,
            invitedBy: member.invitedBy,
            joinedAt: member.createdAt,
        }));

        return { members };
    }

    async inviteUser(
        teamId: number,
        inviterId: number, // 초대자
        inviteeId: number // 초대 대상
    ): Promise<InviteUserResponseDTO> {
        const already = await this.teamRepository.getUserTeamRole(inviteeId, teamId);
        if (already) {
            this.errorService.throw(TeamErrors.USER_ALREADY_IN_TEAM);
        }

        await this.teamRepository.addUserToTeam(teamId, inviteeId, TeamRole.Member, inviterId);

        return {
            teamId,
            userId: inviteeId,
            role: TeamRole.Member,
        };
    }

    async changeUserRole(
        teamId: number,
        changerId: number,
        targetUserId: number,
        role: TeamRole
    ): Promise<ChangeRoleResponseDTO> {
        const changerRole = await this.teamRepository.getUserTeamRole(changerId, teamId);
        if (changerRole !== TeamRole.Owner) {
            this.errorService.throw(TeamErrors.NO_PERMISSION_TO_CHANGE_ROLE);
        }

        const exists = await this.teamRepository.getUserTeamRole(targetUserId, teamId);
        if (!exists) {
            this.errorService.throw(TeamErrors.USER_NOT_IN_TEAM);
        }

        await this.teamRepository.updateUserTeamRole(teamId, targetUserId, role);

        return {
            userId: targetUserId,
            teamId,
            role,
        };
    }

    async leaveTeam(teamId: number, userId: number): Promise<VoidResponseDTO> {
        const role = await this.teamRepository.getUserTeamRole(userId, teamId);

        if (!role) {
            this.errorService.throw(TeamErrors.USER_NOT_IN_TEAM);
        }

        if (role === TeamRole.Owner) {
            this.errorService.throw(TeamErrors.OWNER_CANNOT_LEAVE_TEAM);
        }

        const removed = await this.teamRepository.removeUserFromTeam(userId, teamId);
        if (!removed) {
            this.errorService.throw(TeamErrors.TEAM_NOT_FOUND);
        }

        return { message: "성공적으로 처리되었습니다." }
    }
}