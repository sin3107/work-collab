import { MessageType } from "@common";

export class ChatBroadcastPayloadDTO {
  roomId: number;
  senderId: number;
  content: string;
  type: MessageType;
  createdAt: Date;
  senderSocketId?: string;
}