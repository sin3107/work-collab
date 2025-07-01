import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
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
import { IssueInviteTokenRequestDTO } from './dtos/request/issue-invite-token.request.dto';
import { IssueInviteTokenResponseDTO } from './dtos/response/issue-invite-token.response.dto';
import { ResolveInviteTokenResponseDTO } from './dtos/response/resolve-invite-token.response.dto';

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
        @Param('teamId', ParseIntPipe) teamId: number,
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
        @Param('teamId', ParseIntPipe) teamId: number,
        @CurrentUser() user: { id: number },
    ): Promise<VoidResponseDTO> {
        return await this.teamService.deleteTeam(teamId, user.id);
    }

    @Get(':teamId/members')
    @ApiOperation({ summary: '팀원 조회' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S006']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async getTeamMembers(@Param('teamId', ParseIntPipe) teamId: number): Promise<TeamMemberListResponseDTO> {
        return this.teamService.getTeamMembers(teamId);
    }

    @Post(':teamId/invite')
    @ApiOperation({ summary: '팀원 초대' })
    @SuccessResponse(HttpStatus.CREATED, [TeamSuccess['TEAM-S002']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.NO_PERMISSION_TO_INVITE])
    @ErrorResponse(HttpStatus.CONFLICT, [TeamErrors.USER_ALREADY_IN_TEAM])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.TEAM_NOT_FOUND])
    async inviteUser(
        @Param('teamId', ParseIntPipe) teamId: number,
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
        @Param('teamId', ParseIntPipe) teamId: number,
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
        @Param('teamId', ParseIntPipe) teamId: number,
        @CurrentUser() user: { id: number },
    ): Promise<VoidResponseDTO> {
        return await this.teamService.leaveTeam(teamId, user.id);
    }

    @Post(':teamId/token')
    @ApiOperation({ summary: '초대 토큰 발급' })
    @SuccessResponse(HttpStatus.CREATED, [TeamSuccess['TEAM-S009']])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.NO_PERMISSION_TO_INVITE])
    async issueInviteToken(
        @Param('teamId', ParseIntPipe) teamId: number,
        @Body() dto: IssueInviteTokenRequestDTO,
        @CurrentUser() user: { id: number }
    ): Promise<IssueInviteTokenResponseDTO> {
        return this.teamService.issueInviteToken(teamId, user.id, dto.expiresInHours);
    }

    @Get('invite/:token')
    @ApiOperation({ summary: '초대 토큰 검증 및 팀 정보 조회' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S010']])
    @ErrorResponse(HttpStatus.BAD_REQUEST, [TeamErrors.INVALID_INVITE_TOKEN])
    @ErrorResponse(HttpStatus.GONE, [TeamErrors.EXPIRED_INVITE_TOKEN])
    async resolveInviteToken(
        @Param('token') token: string,
    ): Promise<ResolveInviteTokenResponseDTO> {
        return await this.teamService.resolveInviteToken(token);
    }

    @Patch('/invite/accept/:token')
    @ApiOperation({ summary: '초대 토큰 수락' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S011']])
    @ErrorResponse(HttpStatus.BAD_REQUEST, [TeamErrors.INVALID_INVITE_TOKEN])
    @ErrorResponse(HttpStatus.GONE, [TeamErrors.EXPIRED_INVITE_TOKEN])
    @ErrorResponse(HttpStatus.CONFLICT, [TeamErrors.ALREADY_JOINED_VIA_TOKEN])
    async acceptInviteToken(
        @Param('token') token: string,
        @CurrentUser() user: { id: number },
    ): Promise<VoidResponseDTO> {
        return this.teamService.acceptInviteToken(token, user.id);
    }

    @Delete('invites/:token')
    @ApiOperation({ summary: '초대 토큰 삭제' })
    @SuccessResponse(HttpStatus.OK, [TeamSuccess['TEAM-S012']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [TeamErrors.INVALID_INVITE_TOKEN])
    @ErrorResponse(HttpStatus.FORBIDDEN, [TeamErrors.NO_PERMISSION_TO_DELETE_TOKEN])
    async deleteInviteToken(
        @Param('token') token: string,
        @CurrentUser() user: { id: number }
    ): Promise<VoidResponseDTO> {
        return this.teamService.deleteInviteToken(token, user.id);
    }

}