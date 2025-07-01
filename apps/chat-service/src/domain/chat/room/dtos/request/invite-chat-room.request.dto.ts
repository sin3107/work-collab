import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class InviteChatRoomRequestDTO {
  @ApiProperty({
    type: [Number],
    example: [3, 4, 5],
    description: '초대할 사용자 ID 리스트',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  userIds: number[];
}