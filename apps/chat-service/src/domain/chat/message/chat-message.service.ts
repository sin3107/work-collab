import { Injectable } from '@nestjs/common';
import { ChatMessage } from './schemas/chat-message.schema';
import { ChatMessageRepository } from './chat-message.repository';
import { MessageType } from '@common';
import { ChatBroadcastPayloadDTO } from '../socket/dtos/chat-broadcast.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly chatMessageRepository: ChatMessageRepository) { }

  async sendTextMessage(
    roomId: number,
    senderId: number,
    content: string,
  ): Promise<ChatMessage> {
    return this.chatMessageRepository.saveMessage({
      roomId,
      senderId,
      content,
      type: MessageType.TEXT,
    });
  }

  async getRecentMessages(
    roomId: number,
    since?: Date,
  ): Promise<ChatMessage[]> {
    return this.chatMessageRepository.findMessagesByRoom(roomId, since);
  }

  async saveBroadcastMessage(payload: ChatBroadcastPayloadDTO): Promise<ChatBroadcastPayloadDTO> {
    
    const saved = await this.chatMessageRepository.saveMessage({
      roomId: payload.roomId,
      senderId: payload.senderId,
      content: payload.content,
      type: payload.type,
    });

    return {
      roomId: Number(saved.roomId),
      senderId: Number(saved.senderId),
      content: saved.content,
      type: saved.type,
      createdAt: saved.createdAt,
    };
  }

}
