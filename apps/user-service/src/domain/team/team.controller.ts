import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';
import { CurrentUser, ErrorResponse, SuccessResponse, VoidResponseDTO } from '@common';
import { TeamSuccess } from './response-defines/team-success';
import { CreateTeamResponseDTO } from './dtos/response/create-team.response.dto';
import { InviteUserRequestDTO } from './dtos/request/invite-user.request.dto';
import { InviteUserResponseDTO } from './dtos/response/invite-user.response.dto';
import { TeamErrors } from '@error/constants/team.errors';
import { TeamListResponseDTO } from './dtos/response/list-teams.response.dto';
import { CreateTeamRequestDTO } from './dtos/request/create-team.request.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TeamMemberListResponseDTO } from './dtos/response/list-team-members.response.dto';
import { ChangeRoleRequestDTO } from './dtos/request/chage-role.request.dto';
import { ChangeRoleResponseDTO } from './dtos/response/change-role.response.dto';
import { UpdateTeamResponseDTO } from './dtos/response/update-team.response.dto';
import { UpdateTeamRequestDTO } from './dtos/request/update-team.request.dto';

@UseGuards(AuthGuard)
@Controller('teams')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Get()
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S003']])
    async listMyTeams(
        @CurrentUser() user: { id: number },
    ): Promise<TeamListResponseDTO> {
        return await this.teamService.getMyTeams(user.id);
    }

    @Post()
    @ApiOperation({ summary: '팀 생성' })
    @SuccessResponse(HttpStatus.CREATED, [TeamSuccess['TEAM-S001']])
    @ErrorResponse(HttpStatus.CONFLICT, [TeamErrors.TEAM_ALREADY_JOINED])
    async createTeam(
        @Body() dto: CreateTeamRequestDTO,
        @CurrentUser() user: { id: number },
    ): Promise<CreateTeamResponseDTO> {
        return this.teamService.createTeam(dto, user.id);
    }

    @Patch(':teamId')
    @ApiOperation({ summary: '팀 정보 수정' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S008']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.TEAM_DELETE_FORBIDDEN])
    async updateTeam(
        @Param('teamId') teamId: number,
        @Body() dto: UpdateTeamRequestDTO,
        @CurrentUser() user: { id: number }
    ): Promise<UpdateTeamResponseDTO> {
        return this.teamService.updateTeam(teamId, user.id, dto);
    }

    @Delete(':teamId/owner')
    @ApiOperation({ summary: '팀 삭제' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S005']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [
        TeamErrors.USER_NOT_IN_TEAM,
        TeamErrors.TEAM_DELETE_FORBIDDEN,
    ])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async deleteTeam(
        @Param('teamId') teamId: number,
        @CurrentUser() user: { id: number },
    ): Promise<VoidResponseDTO> {
        return await this.teamService.deleteTeam(teamId, user.id);
    }

    @Get(':teamId/members')
    @ApiOperation({ summary: '팀원 조회' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S006']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async getTeamMembers(@Param('teamId') teamId: number): Promise<TeamMemberListResponseDTO> {
        return this.teamService.getTeamMembers(teamId);
    }

    @Post(':teamId/invite')
    @ApiOperation({ summary: '팀원 초대' })
    @SuccessResponse(HttpStatus.CREATED, [TeamSuccess['TEAM-S002']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.NO_PERMISSION_TO_INVITE])
    @ErrorResponse(HttpStatus.CONFLICT, [TeamErrors.USER_ALREADY_IN_TEAM])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async inviteUser(
        @Param('teamId') teamId: number,
        @Body() dto: InviteUserRequestDTO,
        @CurrentUser() user
    ): Promise<InviteUserResponseDTO> {
        return this.teamService.inviteUser(teamId, user.id, dto.userId);
    }

    @Patch(':teamId/role')
    @ApiOperation({ summary: '팀원 역할 변경' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S007']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.NO_PERMISSION_TO_CHANGE_ROLE])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.USER_NOT_IN_TEAM])
    async changeRole(
        @Param('teamId') teamId: number,
        @Body() dto: ChangeRoleRequestDTO,
        @CurrentUser() user: { id: number }
    ): Promise<ChangeRoleResponseDTO> {
        return this.teamService.changeUserRole(teamId, user.id, dto.userId, dto.role);
    }

    @Delete(':teamId')
    @ApiOperation({ summary: '팀 탈퇴' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S004']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.USER_NOT_IN_TEAM])
    @ErrorResponse(HttpStatus.BAD_REQUEST, [TeamErrors.OWNER_CANNOT_LEAVE_TEAM])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async leaveTeam(
        @Param('teamId') teamId: number,
        @CurrentUser() user: { id: number },
    ): Promise<VoidResponseDTO> {
        return await this.teamService.leaveTeam(teamId, user.id);
    }

}