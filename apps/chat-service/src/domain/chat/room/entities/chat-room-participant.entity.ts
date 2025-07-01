import { CommonEntity } from "@common";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { ChatRoom } from "./chat-room.entity";

@Entity('chat_room_participants')
@Unique(['chatRoomId', 'userId'])
export class ChatRoomParticipant extends CommonEntity {
  @Column({ type: 'int' })
  chatRoomId: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.participants)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'timestamp' })
  joinedAt: Date;

  @Column({ type: 'boolean', default: false })
  isExited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  exitedAt?: Date | null;
}