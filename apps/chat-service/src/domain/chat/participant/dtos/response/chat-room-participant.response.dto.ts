import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomParticipant } from '../../../room/entities/chat-room-participant.entity';


export class ChatRoomParticipantResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  userId: number;

  @ApiProperty({ example: '2024-07-01T12:34:56.789Z' })
  joinedAt: Date;

  @ApiProperty({ example: false })
  isExited: boolean;

  constructor(participant: ChatRoomParticipant) {
    this.id = participant.id;
    this.userId = participant.userId;
    this.joinedAt = participant.joinedAt;
    this.isExited = participant.isExited;
  }
}
