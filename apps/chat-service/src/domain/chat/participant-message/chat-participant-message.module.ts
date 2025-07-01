import { Module, forwardRef } from '@nestjs/common';
import { ChatParticipantMessageService } from './chat-participant-message.service';
import { ChatMessageModule } from '../message/chat-message.module';
import { ChatRoomParticipantModule } from '../participant/chat-room-participant.module';

@Module({
  imports: [
    forwardRef(() => ChatMessageModule),
    forwardRef(() => ChatRoomParticipantModule),
  ],
  providers: [ChatParticipantMessageService],
  exports: [ChatParticipantMessageService],
})
export class ChatParticipantMessageModule {}
