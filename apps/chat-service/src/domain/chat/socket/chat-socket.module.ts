import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WebSocketJwtGuard } from './guards/ws-auth.guard';
import { ChatMessageService } from '../message/chat-message.service';
import { ChatRoomService } from '../room/chat-room.service';
import { RedisInfraModule } from '../../../infra/redis/redis.module';

@Module({
  imports: [RedisInfraModule],
  providers: [
    ChatGateway,
    WebSocketJwtGuard,
    ChatMessageService,
    ChatRoomService,
  ],
  exports: [ChatGateway],
})
export class ChatSocketModule {}
