import { MessageType } from '@common';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatMessageDTO {
  @IsNumber()
  roomId: number;

  @IsNumber()
  senderId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;
}
