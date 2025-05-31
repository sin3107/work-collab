import { ErrorResponseOption } from "@common";

export type UserErrorKeys = 'USER_NOT_FOUND' | 'TOKEN_VALIDATION_FAIL';

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
};