import { ErrorResponseOption } from '@common';

export type TeamErrorKeys =
  | 'TEAM_ALREADY_JOINED'
  | 'TEAM_NOT_FOUND'
  | 'USER_NOT_IN_TEAM'
  | 'NO_PERMISSION_TO_INVITE'
  | 'NO_PERMISSION_TO_CHANGE_ROLE'
  | 'USER_ALREADY_IN_TEAM'
  | 'OWNER_CANNOT_LEAVE_TEAM'
  | 'TEAM_DELETE_FORBIDDEN'
  | 'USER_SERVICE_COMMUNICATION_FAILED'
  | 'INVALID_INVITE_TOKEN'
  | 'EXPIRED_INVITE_TOKEN'
  | 'ALREADY_JOINED_VIA_TOKEN'
  | 'NO_PERMISSION_TO_DELETE_TOKEN';

export const TeamErrors: Record<TeamErrorKeys, ErrorResponseOption> = {
  TEAM_ALREADY_JOINED: {
    exampleTitle: '이미 팀에 가입됨',
    exampleDescription: '해당 사용자는 이미 이 팀에 속해 있습니다.',
    message: '이미 해당 팀에 참여 중입니다.',
    statusCode: 409,
    code: 'TEAM-E001',
  },
  TEAM_NOT_FOUND: {
    exampleTitle: '팀을 찾을 수 없음',
    exampleDescription: '요청한 팀이 존재하지 않거나 삭제되었습니다.',
    message: '존재하지 않는 팀입니다.',
    statusCode: 404,
    code: 'TEAM-E002',
  },
  USER_NOT_IN_TEAM: {
    exampleTitle: '팀 미참여 사용자',
    exampleDescription: '해당 사용자가 팀에 속해 있지 않을 때 발생',
    message: '팀에 소속된 사용자가 아닙니다.',
    statusCode: 403,
    code: 'TEAM-E003',
  },
  NO_PERMISSION_TO_INVITE: {
    exampleTitle: '초대 권한 없음',
    exampleDescription: '해당 사용자는 다른 사용자를 초대할 권한이 없습니다.',
    message: '팀 초대 권한이 없습니다.',
    statusCode: 403,
    code: 'TEAM-E004',
  },
  USER_ALREADY_IN_TEAM: {
    exampleTitle: '사용자 중복 초대',
    exampleDescription: '이미 팀에 소속된 사용자를 초대하려는 경우',
    message: '이미 팀에 가입된 사용자입니다.',
    statusCode: 409,
    code: 'TEAM-E005',
  },
  OWNER_CANNOT_LEAVE_TEAM: {
    exampleTitle: 'Owner 탈퇴 불가',
    exampleDescription: '팀 소유자는 팀에서 탈퇴할 수 없습니다.',
    message: '팀 Owner는 탈퇴할 수 없습니다. 팀 삭제 기능을 이용해주세요.',
    statusCode: 400,
    code: 'TEAM-E006',
  },
  TEAM_DELETE_FORBIDDEN: {
    exampleTitle: '팀 삭제 권한 없음',
    exampleDescription: '해당 사용자가 팀의 Owner가 아닐 경우 발생',
    message: '팀 소유자만 팀을 삭제할 수 있습니다.',
    statusCode: 403,
    code: 'TEAM-E007',
  },
  NO_PERMISSION_TO_CHANGE_ROLE: {
    exampleTitle: '역할 변경 권한 없음',
    exampleDescription: '해당 사용자가 팀의 Owner가 아닌 경우',
    message: '팀 역할을 변경할 권한이 없습니다.',
    statusCode: 403,
    code: 'TEAM-E008',
  },
  INVALID_INVITE_TOKEN: {
    exampleTitle: '유효하지 않은 초대 토큰',
    exampleDescription: '서명이 위조되었거나 구조가 잘못된 초대 토큰',
    message: '초대 토큰이 유효하지 않습니다.',
    statusCode: 400,
    code: 'TEAM-E009',
  },
  EXPIRED_INVITE_TOKEN: {
    exampleTitle: '만료된 초대 토큰',
    exampleDescription: '초대 토큰의 유효기간이 지난 경우',
    message: '초대 토큰이 만료되었습니다.',
    statusCode: 410,
    code: 'TEAM-E010',
  },
  ALREADY_JOINED_VIA_TOKEN: {
    exampleTitle: '이미 팀에 참여된 사용자',
    exampleDescription: '초대 수락을 시도한 사용자가 이미 해당 팀에 속해 있는 경우',
    message: '이미 팀에 참여 중인 사용자입니다.',
    statusCode: 409,
    code: 'TEAM-E011',
  },
  NO_PERMISSION_TO_DELETE_TOKEN: {
    exampleTitle: '초대 토큰 삭제 권한 없음',
    exampleDescription: '초대 토큰 생성자가 아닌 사용자가 삭제를 시도한 경우',
    message: '해당 초대 토큰을 삭제할 권한이 없습니다.',
    statusCode: 403,
    code: 'TEAM-E012',
  },
  USER_SERVICE_COMMUNICATION_FAILED: {
    exampleTitle: '유저 서비스 통신 실패',
    exampleDescription: 'user-service와의 네트워크 또는 서버 오류 발생 시',
    message: '사용자 정보 확인 중 오류가 발생했습니다.',
    statusCode: 502,
    code: 'TEAM-E050',
  },

};
