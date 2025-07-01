import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WebSocketJwtGuard } from 'apps/chat-service/src/domain/chat/socket/guards/ws-auth.guard';
import { RedisPublisherService } from '../../../infra/redis/redis-publisher.service';
import { ChatBroadcastPayloadDTO } from './dtos/chat-broadcast.dto';
import { ChatSuccess } from '../response-defines/chat-success';
import { ChatErrors } from '@error/constants/chat.errors';
import { ChatRoomService } from '../room/chat-room.service';
import { ChatMessageService } from '../message/chat-message.service';

@WebSocketGateway({
    cors: {
        origin: '*', // 또는 실제 허용 origin
    },
})
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly redisPublisherService: RedisPublisherService,
        private readonly chatRoomService: ChatRoomService,
        private readonly chatMessageService: ChatMessageService,
    ) { }

    @UseGuards(WebSocketJwtGuard)
    async handleConnection(@ConnectedSocket() client: Socket) {
        const user = client.data.user;

        const joinedRooms = await this.chatRoomService.getJoinedRoomIds(user.id);
        for (const roomId of joinedRooms) {
            client.join(`room-${roomId}`);
        }

        console.log(`🟢 WebSocket 연결됨: 사용자 ID=${user.id}`);
    }

    @UseGuards(WebSocketJwtGuard)
    @SubscribeMessage('chat:join')
    async handleJoinRoom(
        @MessageBody() payload: { roomId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `room-${payload.roomId}`;
        client.join(roomName);
        client.emit('chat:joined', { roomId: payload.roomId });
        console.log(`사용자 ${client.data.user.id} 채팅방 입장: ${roomName}`);
    }

    @UseGuards(WebSocketJwtGuard)
    @SubscribeMessage('chat:send')
    async handleSendMessage(
        @MessageBody() payload: ChatBroadcastPayloadDTO,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const user = client.data.user;

            // ✅ 참여 여부 확인
            const isJoined = await this.chatRoomService.isUserJoined(payload.roomId, user.id);
            if (!isJoined) {
                client.emit('chat:error', {
                    success: false,
                    ...ChatErrors.CHAT_ROOM_NOT_JOINED,
                });
                return;
            }

            // ✅ 메시지 저장
            const savedMessage = await this.chatMessageService.sendTextMessage(
                payload.roomId,
                user.id,
                payload.content,
            );

            // ✅ Redis 전파
            const broadcastPayload: ChatBroadcastPayloadDTO = {
                roomId: Number(savedMessage.roomId),
                senderId: Number(savedMessage.senderId),
                content: savedMessage.content,
                type: savedMessage.type,
                createdAt: savedMessage.createdAt,
                senderSocketId: client.id
            };

            await this.redisPublisherService.publish('chat-message', {
                ...broadcastPayload,
                senderSocketId: client.id, // 자신 제외
            });

            // ✅ 응답
            client.emit('chat:sent', {
                success: true,
                ...ChatSuccess['CHAT-S002'],
            });
        } catch (error) {
            client.emit('chat:error', {
                success: false,
                ...ChatErrors.CHAT_MESSAGE_SAVE_FAILED,
            });
        }
    }

    broadcastToRoom(roomId: number, message: ChatBroadcastPayloadDTO) {
        this.server.to(`room-${roomId}`).emit('chat:receive', message);
    }

    broadcastToRoomExceptSender(roomId: number, senderSocketId: string, message: ChatBroadcastPayloadDTO) {
        this.server.to(`room-${roomId}`)
            .except(senderSocketId) // 자신 제외
            .emit('chat:receive', message);
    }
}