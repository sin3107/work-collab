import { ErrorResponseOption } from '@common';

export type AuthErrorKeys =
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_REFRESH_TOKEN';

export const AuthErrors: Record<AuthErrorKeys, ErrorResponseOption> = {
  EMAIL_ALREADY_EXISTS: {
    exampleTitle: '이메일 중복 오류',
    exampleDescription: '이미 존재하는 이메일로 회원가입 시도할 때 발생하는 오류',
    message: '이미 가입된 이메일입니다.',
    statusCode: 409,
    code: 'AUTH-E001',
  },
  INVALID_CREDENTIALS: {
    exampleTitle: '로그인 실패',
    exampleDescription: '잘못된 이메일 또는 비밀번호로 로그인할 때 발생하는 오류',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    statusCode: 401,
    code: 'AUTH-E002',
  },
  INVALID_REFRESH_TOKEN: {
    exampleTitle: 'RefreshToken 검증 실패',
    exampleDescription: 'RefreshToken이 유효하지 않음',
    message: 'RefreshToken이 유효하지 않습니다.',
    statusCode: 401,
    code: 'AUTH-E003',
  },
};
