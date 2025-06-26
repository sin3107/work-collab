import { SuccessResponseOption } from '@common/decorators/success-response.decorator';
import { VoidResponseDTO } from '@common';
import { CreateTeamResponseDTO } from '../dtos/response/create-team.response.dto';
import { InviteUserResponseDTO } from '../dtos/response/invite-user.response.dto';
import { TeamListResponseDTO } from '../dtos/response/list-teams.response.dto';
import { TeamMemberListResponseDTO } from '../dtos/response/list-team-members.response.dto';
import { ChangeRoleResponseDTO } from '../dtos/response/change-role.response.dto';
import { UpdateTeamResponseDTO } from '../dtos/response/update-team.response.dto';

export type TeamSuccessKeys =
  | 'TEAM-S001' // 팀 생성
  | 'TEAM-S002' // 팀 초대
  | 'TEAM-S003' // 내 팀 목록 조회
  | 'TEAM-S004' // 팀 탈퇴
  | 'TEAM-S005' // 팀 삭제
  | 'TEAM-S006' // 팀원 목록 조회
  | 'TEAM-S007' // 팀 역할 변경
  | 'TEAM-S008'; // 팀 정보 수정

export const TeamSuccess: Record<TeamSuccessKeys, SuccessResponseOption & { code: string }> = {
  'TEAM-S001': {
    model: CreateTeamResponseDTO,
    exampleTitle: '팀 생성 성공',
    exampleDescription: '요청한 정보로 팀이 성공적으로 생성되었습니다.',
    code: 'TEAM-S001',
  },
  'TEAM-S002': {
    model: InviteUserResponseDTO,
    exampleTitle: '팀 초대 성공',
    exampleDescription: '지정한 사용자를 팀에 성공적으로 초대했습니다.',
    code: 'TEAM-S002',
  },
  'TEAM-S003': {
    model: TeamListResponseDTO,
    exampleTitle: '내 팀 목록 조회 성공',
    exampleDescription: '내가 소속된 모든 팀이 정상적으로 조회되었습니다.',
    code: 'TEAM-S003',
  },
  'TEAM-S004': {
    model: VoidResponseDTO,
    exampleTitle: '팀 탈퇴 성공',
    exampleDescription: '요청한 팀에서 정상적으로 탈퇴되었습니다.',
    code: 'TEAM-S004',
  },
  'TEAM-S005': {
    model: VoidResponseDTO,
    exampleTitle: '팀 삭제 성공',
    exampleDescription: '팀이 성공적으로 삭제되었습니다.',
    code: 'TEAM-S005',
  },
  'TEAM-S006': {
    model: TeamMemberListResponseDTO,
    exampleTitle: '팀원 목록 조회 성공',
    exampleDescription: '요청한 팀에 대한 팀원 목록이 성공적으로 반환되었습니다.',
    code: 'TEAM-S006',
  },
  'TEAM-S007': {
    model: ChangeRoleResponseDTO,
    exampleTitle: '팀 역할 변경 성공',
    exampleDescription: '해당 사용자의 팀 내 역할이 정상적으로 변경되었습니다.',
    code: 'TEAM-S007',
  },
  'TEAM-S008': {
    model: UpdateTeamResponseDTO,
    exampleTitle: '팀 정보 수정 성공',
    exampleDescription: '팀 정보가 성공적으로 수정되었습니다.',
    code: 'TEAM-S008',
  },
};
