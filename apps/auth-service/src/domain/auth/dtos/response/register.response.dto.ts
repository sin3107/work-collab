import { UserRole } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: '테스트 유저' })
  name: string;

  @ApiProperty({ example: '테스트 유저' })
  role: UserRole;
}
