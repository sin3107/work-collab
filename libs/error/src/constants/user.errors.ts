import { ErrorResponseOption } from "@common";

export type UserErrorKeys =
  'USER_NOT_FOUND' |
  'TOKEN_VALIDATION_FAIL' |
  'EMAIL_ALREADY_EXISTS';

export const UserErrors: Record<UserErrorKeys, ErrorResponseOption> = {
  USER_NOT_FOUND: {
    exampleTitle: '유저 조회 실패',
    exampleDescription: '존재하지 않는 유저를 조회했을 때',
    message: '해당 유저를 찾을 수 없습니다.',
    statusCode: 404,
    code: 'USER-E001',
  },
  TOKEN_VALIDATION_FAIL: {
    exampleTitle: '토큰 검증 실패',
    exampleDescription: '유효하지 않거나 만료된 토큰으로 접근했을 때 발생하는 에러',
    message: '토큰이 유효하지 않습니다.',
    statusCode: 401,
    code: 'USER-E002',
  },
  EMAIL_ALREADY_EXISTS: {
    exampleTitle: '이메일 중복',
    exampleDescription: '이미 가입된 이메일로 유저를 생성하려고 할 때',
    message: '이미 해당 이메일로 가입된 유저가 존재합니다.',
    statusCode: 409,
    code: 'USER-E003',
  },
};