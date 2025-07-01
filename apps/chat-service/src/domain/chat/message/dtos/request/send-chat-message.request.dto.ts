import { ApiProperty } from '@nestjs/swagger';

export class SendChatMessageDTO {
  @ApiProperty({ example: 1 })
  roomId: number;

  @ApiProperty({ example: 7 })
  senderId: number;

  @ApiProperty({ example: '안녕하세요!' })
  content: string;
}