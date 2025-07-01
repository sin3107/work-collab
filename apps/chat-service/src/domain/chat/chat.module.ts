import { Module } from '@nestjs/common';
import { ChatMessageModule } from './message/chat-message.module';
import { ChatRoomModule } from './room/chat-room.module';
import { ChatSocketModule } from './socket/chat-socket.module';
import { ChatRoomParticipantModule } from './participant/chat-room-participant.module';
import { ChatParticipantMessageModule } from './participant-message/chat-participant-message.module';

@Module({
  imports: [
    ChatMessageModule,
    ChatRoomModule,
    ChatRoomParticipantModule,
    ChatParticipantMessageModule,
    ChatSocketModule,
  ],
})
export class ChatModule {}
