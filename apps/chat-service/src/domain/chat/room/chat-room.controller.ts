import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomRequestDTO } from './dtos/request/create-chat-room.request.dto';
import { ChatRoomResponseDTO } from './dtos/response/chat-room.response.dto';

import { SuccessResponse } from '@common/decorators/success-response.decorator';
import { ErrorResponse } from '@common/decorators/error-response.decorator';
import { ChatSuccess } from '../response-defines/chat-success';
import { ChatErrors } from '@error/constants/chat.errors';
import { InviteChatRoomRequestDTO } from './dtos/request/invite-chat-room.request.dto';
import { ChatRoomParticipantResponseDTO } from '../participant/dtos/response/chat-room-participant.response.dto';
import { CurrentUser } from '@common';

@Controller('chat-room')
export class ChatRoomController {
    constructor(private readonly chatRoomService: ChatRoomService) { }

    @Post()
    @SuccessResponse(HttpStatus.CREATED, [ChatSuccess['CHAT-S003']])
    @ErrorResponse(HttpStatus.CONFLICT, [ChatErrors.CHAT_ROOM_NAME_CONFLICT])
    async createRoom(
        @Body() dto: CreateChatRoomRequestDTO,
    ): Promise<ChatRoomResponseDTO> {
        const room = await this.chatRoomService.createRoom(dto);

        return {
            id: room.id,
            name: room.name,
            type: room.type,
            teamId: room.teamId,
            createdAt: room.createdAt,
        };
    }

    @Post(':id/invite')
    @SuccessResponse(HttpStatus.CREATED, [ChatSuccess['CHAT-S004']])
    @ErrorResponse(HttpStatus.CONFLICT, [ChatErrors.CHAT_ROOM_ALREADY_JOINED])
    @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_FOUND])
    async inviteUsers(
        @Param('id', ParseIntPipe) roomId: number,
        @Body() dto: InviteChatRoomRequestDTO,
    ): Promise<ChatRoomParticipantResponseDTO[]> {
        const participants = await this.chatRoomService.inviteUsers(roomId, dto.userIds);
        return participants.map(p => new ChatRoomParticipantResponseDTO(p));
    }

    @Get()
    @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S006']])
    async getAllRooms(): Promise<ChatRoomResponseDTO[]> {
        const rooms = await this.chatRoomService.getAllRooms();
        return rooms.map((room) => new ChatRoomResponseDTO(room));
    }

    @Get('/my')
    @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S007']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_USER_NOT_FOUND])
    async getJoinedRooms(
        @CurrentUser() user: { id: number }
    ): Promise<ChatRoomResponseDTO[]> {
        const rooms = await this.chatRoomService.getJoinedRooms(user.id);
        return rooms.map((room) => new ChatRoomResponseDTO(room));
    }

    @Patch(':roomId/leave')
    @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S008']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_FOUND])
    async leaveRoom(
        @Param('roomId', ParseIntPipe) roomId: number,
        @CurrentUser() user: { id: number }
    ): Promise<void> {
        await this.chatRoomService.leaveRoom(roomId, user.id);
    }

    @Get(':roomId')
    @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S009']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_FOUND])
    async getRoom(
        @Param('roomId', ParseIntPipe) roomId: number,
    ): Promise<ChatRoomResponseDTO> {
        const room = await this.chatRoomService.getRoomById(roomId);
        return new ChatRoomResponseDTO(room);
    }

    @Delete(':roomId')
    @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S010']])
    @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_FOUND])
    async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<void> {
        await this.chatRoomService.softDeleteRoom(roomId);
    }
}
