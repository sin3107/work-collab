import { MessageType } from '@common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
    @Prop({ required: true })
    roomId: string;

    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    content: string;

    @Prop({ enum: MessageType, default: MessageType.TEXT })
    type: MessageType;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
