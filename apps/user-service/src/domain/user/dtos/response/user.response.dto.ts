import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

export class UserResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'User', enum: UserRole })
  role: UserRole;
}
