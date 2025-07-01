import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatRoomParticipant } from './entities/chat-room-participant.entity';
import { CreateChatRoomRequestDTO } from './dtos/request/create-chat-room.request.dto';
import { ChatRoomParticipantRepository } from '../participant/chat-room-participant.repository';
import { ErrorService } from '@error';
import { ChatErrors } from '@error/constants/chat.errors';


@Injectable()
export class ChatRoomService {
    constructor(
        private readonly chatRoomRepository: ChatRoomRepository,
        private readonly chatRoomParticipantRepository: ChatRoomParticipantRepository,
        private readonly errorService: ErrorService,
    ) { }

    async createRoom(dto: CreateChatRoomRequestDTO): Promise<ChatRoom> {
        const isDuplicate = await this.chatRoomRepository.existsByNameAndTeam(dto.name, dto.teamId);
        if (isDuplicate) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_NAME_CONFLICT);
        }

        const room = await this.chatRoomRepository.createRoom(dto);
        await this.chatRoomParticipantRepository.addParticipant(room.id, dto.createdBy);

        return room;
    }

    async getRoomById(id: number): Promise<ChatRoom> {
        const room = await this.chatRoomRepository.findByIdWithParticipants(id);
        if (!room) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_NOT_FOUND);
        }
        return room;
    }

    async getParticipants(roomId: number): Promise<ChatRoomParticipant[]> {
        return await this.chatRoomParticipantRepository.findActiveByRoomId(roomId);
    }

    async inviteUsers(roomId: number, userIds: number[]): Promise<ChatRoomParticipant[]> {
        const room = await this.chatRoomRepository.findByIdWithParticipants(roomId);
        if (!room) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_NOT_FOUND);
        }

        const existingIds = room.participants
            .filter((p) => !p.isExited)
            .map((p) => p.userId);

        const duplicates = userIds.filter((id) => existingIds.includes(id));
        if (duplicates.length > 0) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_ALREADY_JOINED);
        }

        return await this.chatRoomParticipantRepository.addParticipants(room.id, userIds);

    }

    async isUserJoined(roomId: number, userId: number): Promise<boolean> {
        return this.chatRoomParticipantRepository.existsActiveParticipant(roomId, userId);
    }

    async getJoinedRoomIds(userId: number): Promise<number[]> {
        return await this.chatRoomParticipantRepository.findJoinedRoomIdsByUser(userId);
    }

    async getAllRooms(): Promise<ChatRoom[]> {
        return await this.chatRoomRepository.findAll();
    }

    async getJoinedRooms(userId: number): Promise<ChatRoom[]> {
        const rooms = await this.chatRoomRepository.findJoinedRoomsByUserId(userId);
        if (rooms.length === 0) {
            this.errorService.throw(ChatErrors.CHAT_USER_NOT_FOUND);
        }
        return rooms;
    }
    async leaveRoom(roomId: number, userId: number): Promise<void> {
        const participant = await this.chatRoomParticipantRepository.findOneByRoomAndUser(roomId, userId);

        if (!participant || participant.isExited) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_NOT_FOUND);
        }

        await this.chatRoomParticipantRepository.exitRoom(roomId, userId);
    }


    async softDeleteRoom(id: number): Promise<void> {
        const room = await this.chatRoomRepository.findById(id);
        if (!room) {
            this.errorService.throw(ChatErrors.CHAT_ROOM_NOT_FOUND);
        }

        room.isDeleted = true;
        await this.chatRoomRepository.save(room);
    }
}