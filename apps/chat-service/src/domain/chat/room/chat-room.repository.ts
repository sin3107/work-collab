import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { CreateChatRoomRequestDTO } from './dtos/request/create-chat-room.request.dto';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) { }

  async existsByNameAndTeam(name: string, teamId: number): Promise<boolean> {
    const count = await this.chatRoomRepository.count({ where: { name, teamId } });
    return count > 0;
  }

  async createRoom(dto: CreateChatRoomRequestDTO): Promise<ChatRoom> {
    const room = this.chatRoomRepository.create(dto);
    return await this.chatRoomRepository.save(room);
  }

  async findByIdWithParticipants(id: number): Promise<ChatRoom | null> {
    return await this.chatRoomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['participants'],
    });
  }

  async findAll(): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findJoinedRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    return this.chatRoomRepository
      .createQueryBuilder('room')
      .innerJoin('room.participants', 'participant', 'participant.userId = :userId AND participant.isExited = false', { userId })
      .where('room.isDeleted = false')
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async findById(id: number): Promise<ChatRoom | null> {
    return await this.chatRoomRepository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async save(room: ChatRoom): Promise<ChatRoom> {
    return await this.chatRoomRepository.save(room);
  }

}
