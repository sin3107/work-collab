import { SuccessResponseOption } from '@common/decorators/success-response.decorator';
import { ChatMessageResponseDTO } from '../message/dtos/response/chat-message.response.dto';
import { ChatRoomResponseDTO } from '../room/dtos/response/chat-room.response.dto';
import { ChatRoomParticipantResponseDTO } from '../participant/dtos/response/chat-room-participant.response.dto';
import { VoidResponseDTO } from '@common';

export type ChatSuccessKeys =
  | 'CHAT-S001'
  | 'CHAT-S002'
  | 'CHAT-S003'
  | 'CHAT-S004'
  | 'CHAT-S005'
  | 'CHAT-S006'
  | 'CHAT-S007'
  | 'CHAT-S008'
  | 'CHAT-S009'
  | 'CHAT-S010';

export const ChatSuccess: Record<ChatSuccessKeys, SuccessResponseOption & { code: string }> = {
  'CHAT-S001': {
    model: ChatMessageResponseDTO,
    exampleTitle: '채팅 메시지 조회 성공',
    exampleDescription: '채팅방의 메시지를 정상적으로 불러왔습니다.',
    code: 'CHAT-S001',
  },
  'CHAT-S002': {
    model: ChatMessageResponseDTO,
    exampleTitle: '채팅 메시지 전송 성공',
    exampleDescription: '채팅 메시지를 저장하고 브로드캐스트에 성공했습니다.',
    code: 'CHAT-S002',
  },
  'CHAT-S003': {
    model: ChatRoomResponseDTO,
    exampleTitle: '채팅방 생성 성공',
    exampleDescription: '새로운 채팅방이 정상적으로 생성되었습니다.',
    code: 'CHAT-S003',
  },
  'CHAT-S004': {
    model: ChatRoomParticipantResponseDTO,
    exampleTitle: '채팅방 초대 성공',
    exampleDescription: '지정된 유저들이 채팅방에 성공적으로 초대되었습니다.',
    code: 'CHAT-S004',
  },
  'CHAT-S005': {
    model: ChatMessageResponseDTO,
    exampleTitle: '참여자 기준 메시지 조회 성공',
    exampleDescription: '채팅방에 입장한 이후의 메시지를 정상적으로 불러왔습니다.',
    code: 'CHAT-S005',
  },
  'CHAT-S006': {
    model: ChatRoomResponseDTO,
    exampleTitle: '채팅방 목록 조회 성공',
    exampleDescription: '전체 채팅방 목록을 불러왔습니다.',
    code: 'CHAT-S006',
  },
  'CHAT-S007': {
    model: ChatRoomResponseDTO,
    exampleTitle: '내 채팅방 목록 조회 성공',
    exampleDescription: '사용자가 참여 중인 채팅방 목록을 정상적으로 조회했습니다.',
    code: 'CHAT-S007',
  },
  'CHAT-S008': {
    model: VoidResponseDTO,
    exampleTitle: '채팅방 나가기 성공',
    exampleDescription: '채팅방에서 성공적으로 나갔습니다.',
    code: 'CHAT-S008',
  },
  'CHAT-S009': {
    model: ChatRoomResponseDTO,
    exampleTitle: '채팅방 단일 조회 성공',
    exampleDescription: '지정한 ID의 채팅방 정보를 조회했습니다.',
    code: 'CHAT-S009',
  },
  'CHAT-S010': {
    model: VoidResponseDTO,
    exampleTitle: '채팅방 삭제 성공',
    exampleDescription: '채팅방을 성공적으로 soft delete 했습니다.',
    code: 'CHAT-S010',
  },
};
