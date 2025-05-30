import { SuccessResponseOption } from '@common/decorators/success-response.decorator';
import { UserRegisterResponseDTO } from '../dtos/response/register.response.dto';
export type AuthSuccessKeys = 'AUTH-S001';

export const AuthSuccess: Record<AuthSuccessKeys, SuccessResponseOption & { code: string }> = {
  'AUTH-S001': {
    model: UserRegisterResponseDTO,
    exampleTitle: '회원가입 성공',
    exampleDescription: '회원가입이 정상적으로 완료되었습니다.',
    code: 'AUTH-S001',
  },
};
