import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './schemas/chat-message.schema';
import { CreateChatMessageDTO } from './dtos/internal/create-chat-message.dto';

@Injectable()
export class ChatMessageRepository {
    constructor(
        @InjectModel(ChatMessage.name)
        private readonly messageModel: Model<ChatMessage>,
    ) { }

    async saveMessage(dto: CreateChatMessageDTO): Promise<ChatMessage> {
  const message = new this.messageModel({
    ...dto,
    createdAt: new Date(),
    isDeleted: false,
  });

  return await message.save();
}

    async findMessagesByRoom(roomId: number, since?: Date): Promise<ChatMessage[]> {
        let filter: any = { roomId, isDeleted: false };

        if (since) {
            filter.createdAt = { $gte: since };
        }

        return this.messageModel
            .find(filter)
            .sort({ createdAt: 1 })
            .exec();
    }

    
}
