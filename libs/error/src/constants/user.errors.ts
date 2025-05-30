import { ErrorResponseOption } from "@common";

export type UserErrorKeys = 'USER_NOT_FOUND' | 'USER_DUPLICATE_EMAIL';

export const UserErrors: Record<UserErrorKeys, ErrorResponseOption> = {
  USER_NOT_FOUND: {
    exampleTitle: '유저 조회 실패',
    exampleDescription: '존재하지 않는 유저를 조회했을 때',
    message: '해당 유저를 찾을 수 없습니다.',
    statusCode: 404,
    code: 'USER-E001',
  },
  USER_DUPLICATE_EMAIL: {
    exampleTitle: '이메일 중복',
    exampleDescription: '회원가입 시 이메일이 이미 존재할 때',
    message: '이미 존재하는 이메일입니다.',
    statusCode: 409,
    code: 'USER-E002',
  },
};