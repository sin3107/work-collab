import { Injectable } from '@nestjs/common';
import { ChatRoomParticipantRepository } from '../participant/chat-room-participant.repository';
import { ChatMessageRepository } from '../message/chat-message.repository';
import { ChatMessage } from '../message/schemas/chat-message.schema';
import { ErrorService } from '@error/error.service';
import { ChatErrors } from '@error/constants/chat.errors';

@Injectable()
export class ChatParticipantMessageService {
  constructor(
    private readonly participantRepository: ChatRoomParticipantRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly errorService: ErrorService,
  ) {}

  async findMessagesAfterJoined(roomId: number, userId: number): Promise<ChatMessage[]> {
    const participant = await this.participantRepository.findByRoomAndUser(roomId, userId);
    if (!participant) {
      this.errorService.throw(ChatErrors.CHAT_ROOM_NOT_JOINED);
    }

    return await this.chatMessageRepository.findMessagesByRoom(roomId, participant.joinedAt);
  }
}
