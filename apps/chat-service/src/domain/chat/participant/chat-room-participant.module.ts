import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomParticipant } from '../room/entities/chat-room-participant.entity';
import { ChatRoomParticipantRepository } from './chat-room-participant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomParticipant])],
  providers: [ChatRoomParticipantRepository],
  exports: [ChatRoomParticipantRepository],
})
export class ChatRoomParticipantModule {}
