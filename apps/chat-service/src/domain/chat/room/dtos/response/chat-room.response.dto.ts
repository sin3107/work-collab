import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from '@common';
import { ChatRoom } from '../../entities/chat-room.entity';

export class ChatRoomResponseDTO {
  @ApiProperty({ description: '채팅방 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '채팅방 이름', example: '개발팀' })
  name: string;

  @ApiProperty({ description: '채팅방 타입', enum: ChatRoomType })
  type: ChatRoomType;

  @ApiProperty({ description: '팀 ID (없으면 null)', example: 2, nullable: true })
  teamId: number | null;

  @ApiProperty({ description: '생성 시간', example: '2025-07-01T12:00:00Z' })
  createdAt: Date;

  constructor(room: ChatRoom) {
    this.id = room.id;
    this.name = room.name;
    this.type = room.type;
    this.teamId = room.teamId;
    this.createdAt = room.createdAt;
  }
}