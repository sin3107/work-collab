import { SuccessResponseOption } from '@common/decorators/success-response.decorator';
import { UserResponseDTO } from '../dtos/response/user.response.dto';

export type UserSuccessKeys =
  | 'USER-S001'
  | 'USER-S002'
  | 'USER-S003';

export const UserSuccess: Record<UserSuccessKeys, SuccessResponseOption & { code: string }> = {
  'USER-S001': {
    model: UserResponseDTO,
    exampleTitle: '회원 생성 성공',
    exampleDescription: '새로운 사용자가 정상적으로 등록되었습니다.',
    code: 'USER-S001',
  },
  'USER-S002': {
    model: UserResponseDTO,
    exampleTitle: '이메일로 유저 조회 성공',
    exampleDescription: '해당 이메일로 사용자를 정상 조회하였습니다.',
    code: 'USER-S002',
  },
  'USER-S003': {
    model: UserResponseDTO,
    exampleTitle: 'ID로 유저 조회 성공',
    exampleDescription: '해당 ID로 사용자를 정상 조회하였습니다.',
    code: 'USER-S003',
  },
};
