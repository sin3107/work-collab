import { ErrorDetail } from './error.interface';

export const Errors = {
  Auth: {
    EMAIL_ALREADY_EXISTS: {
      code: 'AUTH_001',
      message: '이미 가입된 이메일입니다.',
      statusCode: 409,
    },
    INVALID_CREDENTIALS: {
      code: 'AUTH_002',
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      statusCode: 401,
    },
  },
  User: {
    USER_NOT_FOUND: {
      code: 'USER_001',
      message: '존재하지 않는 사용자입니다.',
      statusCode: 404,
    },
  },
  Common: {
    UNAUTHORIZED: {
      code: 'COMMON_001',
      message: '인증이 필요합니다.',
      statusCode: 401,
    },
    FORBIDDEN: {
      code: 'COMMON_002',
      message: '권한이 없습니다.',
      statusCode: 403,
    },
    INTERNAL_SERVER_ERROR: {
      code: 'COMMON_003',
      message: '서버 내부 오류입니다.',
      statusCode: 500,
    },
  },
} as const;
