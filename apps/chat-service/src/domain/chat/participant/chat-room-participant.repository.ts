import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomParticipant } from '../room/entities/chat-room-participant.entity';

@Injectable()
export class ChatRoomParticipantRepository {
  constructor(
    @InjectRepository(ChatRoomParticipant)
    private readonly chatRoomParticipantRepository: Repository<ChatRoomParticipant>,
  ) { }

  async addParticipant(chatRoomId: number, userId: number): Promise<ChatRoomParticipant> {
    const participant = this.chatRoomParticipantRepository.create({
      chatRoomId,
      userId,
      joinedAt: new Date(),
    });
    return await this.chatRoomParticipantRepository.save(participant);
  }

  async addParticipants(roomId: number, userIds: number[]): Promise<ChatRoomParticipant[]> {
    const participants = userIds.map(userId => this.chatRoomParticipantRepository.create({
      chatRoomId: roomId,
      userId,
      joinedAt: new Date(),
    }));

    return await this.chatRoomParticipantRepository.save(participants);
  }

  async findActiveByRoomId(chatRoomId: number): Promise<ChatRoomParticipant[]> {
    return await this.chatRoomParticipantRepository.find({
      where: { chatRoomId, isExited: false },
      order: { joinedAt: 'ASC' },
    });
  }

  async findByRoomAndUser(chatRoomId: number, userId: number): Promise<ChatRoomParticipant | null> {
    return await this.chatRoomParticipantRepository.findOne({
      where: {
        chatRoomId,
        userId,
        isExited: false,
      },
    });
  }

  async existsActiveParticipant(roomId: number, userId: number): Promise<boolean> {
    const count = await this.chatRoomParticipantRepository.count({
      where: {
        chatRoomId: roomId,
        userId,
        isExited: false,
      },
    });
    return count > 0;
  }

  async findJoinedRoomIdsByUser(userId: number): Promise<number[]> {
    const records = await this.chatRoomParticipantRepository.find({
      where: { userId, isExited: false },
      select: ['chatRoomId'],
    });
    return records.map((p) => p.chatRoomId);
  }

  async exitRoom(chatRoomId: number, userId: number): Promise<void> {
    await this.chatRoomParticipantRepository.update(
      { chatRoomId, userId, isExited: false },
      {
        isExited: true,
        exitedAt: new Date(),
      },
    );
  }

  async findOneByRoomAndUser(chatRoomId: number, userId: number): Promise<ChatRoomParticipant | null> {
    return await this.chatRoomParticipantRepository.findOne({
      where: { chatRoomId, userId },
    });
  }

}
