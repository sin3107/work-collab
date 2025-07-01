import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ChatGateway } from '../../domain/chat/socket/chat.gateway';
import { ChatBroadcastPayloadDTO } from '../../domain/chat/socket/dtos/chat-broadcast.dto';

@Injectable()
export class RedisSubscriberService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly redisSubClient: Redis,
    private readonly chatGateway: ChatGateway,
  ) { }

  onModuleInit() {
    this.redisSubClient.subscribe('chat-message');
    this.redisSubClient.on('message', (channel, payload) => {
      if (channel === 'chat-message') {
        try {
          const message: ChatBroadcastPayloadDTO & { senderSocketId?: string } = JSON.parse(payload);

          if (!message.roomId) {
            console.warn('❗ roomId 누락된 메시지 수신:', message);
            return;
          }

          console.log('📨 Redis 수신:', message);

          this.chatGateway.broadcastToRoomExceptSender(
            message.roomId,
            message.senderSocketId ?? '',
            message,
          );
        } catch (err) {
          console.error('❌ Redis 메시지 파싱 실패:', err);
        }
      }
    });
  }
}
