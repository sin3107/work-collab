import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class InviteUserRequestDTO {
  @ApiProperty({ example: 12, description: '초대할 사용자 ID' })
  @IsNumber()
  userId: number;
}
