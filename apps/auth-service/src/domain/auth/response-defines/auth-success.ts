import { SuccessResponseOption } from '@common/decorators/success-response.decorator';
import { UserRegisterResponseDTO } from '../dtos/response/register.response.dto';
import { LoginResponseDTO } from '../dtos/response/login.response.dto';
import { GetMeResponseDTO } from '../dtos/response/get-me.response.dto';
import { VoidResponseDTO } from '@common';

export type AuthSuccessKeys =
  | 'AUTH-S001'
  | 'AUTH-S002'
  | 'AUTH-S003'
  | 'AUTH-S004'
  | 'AUTH-S005';

export const AuthSuccess: Record<AuthSuccessKeys, SuccessResponseOption & { code: string }> = {
  'AUTH-S001': {
    model: UserRegisterResponseDTO,
    exampleTitle: '회원가입 성공',
    exampleDescription: '회원가입이 정상적으로 완료되었습니다.',
    code: 'AUTH-S001',
  },
  'AUTH-S002': {
    model: LoginResponseDTO,
    exampleTitle: '로그인 성공',
    exampleDescription: '로그인이 정상적으로 완료되었습니다.',
    code: 'AUTH-S002',
  },
  'AUTH-S003': {
    model: GetMeResponseDTO,
    exampleTitle: '내 정보 조회 성공',
    exampleDescription: '내 정보가 정상적으로 조회되었습니다.',
    code: 'AUTH-S003',
  },
  'AUTH-S004': {
    model: VoidResponseDTO,
    exampleTitle: '로그아웃 성공',
    exampleDescription: '정상적으로 로그아웃되었습니다.',
    code: 'AUTH-S004',
  },
  'AUTH-S005': {
    model: LoginResponseDTO,
    exampleTitle: 'RefreshToken 재발급 성공',
    exampleDescription: 'AccessToken과 RefreshToken이 재발급되었습니다.',
    code: 'AUTH-S005',
  },
};
