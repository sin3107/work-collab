import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatMessageService } from './chat-message.service';
import { CurrentUser, ErrorResponse, SuccessResponse } from '@common';
import { ChatMessageResponseDTO } from './dtos/response/chat-message.response.dto';
import { SendChatMessageDTO } from './dtos/request/send-chat-message.request.dto';
import { ChatSuccess } from '../response-defines/chat-success';
import { ChatErrors } from '@error/constants/chat.errors';
import { ChatParticipantMessageService } from '../participant-message/chat-participant-message.service';

@Controller('chat')
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly chatParticipantMessageService: ChatParticipantMessageService
  ) { }

  @Post('send')
  @ApiOperation({ summary: '채팅 메시지 전송' })
  @SuccessResponse(HttpStatus.CREATED, [ChatSuccess['CHAT-S002']])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [ChatErrors.INVALID_CHAT_REQUEST])
  async sendMessage(
    @Body() dto: SendChatMessageDTO,
  ): Promise<ChatMessageResponseDTO> {
    const message = await this.chatMessageService.sendTextMessage(
      dto.roomId,
      dto.senderId,
      dto.content,
    );

    return {
      id: message._id.toString(),
      roomId: message.roomId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt,
    };
  }

  @Get('messages')
  @ApiOperation({ summary: '채팅 메시지 조회' })
  @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S001']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_FOUND])
  async getMessages(
    @Query('roomId') roomId: number,
    @Query('since') since?: string,
  ): Promise<ChatMessageResponseDTO[]> {
    const messages = await this.chatMessageService.getRecentMessages(
      roomId,
      since ? new Date(since) : undefined,
    );

    return messages.map((msg) => ({
      id: msg._id.toString(),
      roomId: msg.roomId,
      senderId: msg.senderId,
      content: msg.content,
      type: msg.type,
      createdAt: msg.createdAt,
    }));
  }

  @Get(':roomId/participant')
  @SuccessResponse(HttpStatus.OK, [ChatSuccess['CHAT-S005']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [ChatErrors.CHAT_ROOM_NOT_JOINED])
  async getMessagesByParticipant(
    @Param('roomId', ParseIntPipe) roomId: number,
    @CurrentUser() user: { id: number }
  ): Promise<ChatMessageResponseDTO[]> {
    const messages = await this.chatParticipantMessageService.findMessagesAfterJoined(roomId, user.id);
    return messages.map((msg) => new ChatMessageResponseDTO(msg));
  }
}