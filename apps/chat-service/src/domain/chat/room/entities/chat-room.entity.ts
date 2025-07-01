import { ChatRoomType, CommonEntity } from '@common';
import { Entity, Column, OneToMany } from 'typeorm';
import { ChatRoomParticipant } from './chat-room-participant.entity';

@Entity('chat_rooms')
export class ChatRoom extends CommonEntity {
    @Column({ nullable: true })
    teamId: number | null;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ChatRoomType, default: ChatRoomType.PRIVATE })
    type: ChatRoomType;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToMany(() => ChatRoomParticipant, (participant) => participant.chatRoom)
    participants: ChatRoomParticipant[];

    @Column({ nullable: false })
    createdBy: number;
}
