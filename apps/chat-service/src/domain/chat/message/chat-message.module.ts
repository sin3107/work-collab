import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { ChatMessageService } from './chat-message.service';
import { RedisInfraModule } from 'apps/chat-service/src/infra/redis/redis.module';
import { RedisPublisherService } from 'apps/chat-service/src/infra/redis/redis-publisher.service';
import { RedisSubscriberService } from 'apps/chat-service/src/infra/redis/redis-subscriber.service';
import { ChatMessageRepository } from './chat-message.repository';

@Module({
  imports: [
    RedisInfraModule,
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatMessageController],
  providers: [
    RedisPublisherService,
    RedisSubscriberService,
    ChatMessageService,
    ChatMessageRepository,
  ],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
