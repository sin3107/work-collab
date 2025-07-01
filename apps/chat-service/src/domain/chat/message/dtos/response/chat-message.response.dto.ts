import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from "@common";
import { ChatMessage } from "../../schemas/chat-message.schema";

export class ChatMessageResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  createdAt: Date;

  constructor(entity: ChatMessage) {
    this.roomId = entity.roomId;
    this.senderId = entity.senderId;
    this.content = entity.content;
    this.type = entity.type;
    this.createdAt = entity.createdAt;
  }
}
