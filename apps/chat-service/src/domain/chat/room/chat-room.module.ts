import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatRoomParticipant } from './entities/chat-room-participant.entity';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoomParticipantRepository } from '../participant/chat-room-participant.repository';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatRoomParticipant])],
  providers: [ChatRoomRepository, ChatRoomParticipantRepository, ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
