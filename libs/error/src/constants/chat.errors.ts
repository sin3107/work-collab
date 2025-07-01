import { ErrorResponseOption } from '@common';

export type ChatErrorKeys =
  | 'CHAT_ROOM_NOT_FOUND'
  | 'INVALID_CHAT_REQUEST'
  | 'CHAT_MESSAGE_SAVE_FAILED'
  | 'CHAT_ROOM_NAME_CONFLICT'
  | 'CHAT_ROOM_ALREADY_JOINED'
  | 'CHAT_ROOM_NOT_JOINED'
  | 'CHAT_USER_NOT_FOUND';

export const ChatErrors: Record<ChatErrorKeys, ErrorResponseOption> = {
  CHAT_ROOM_NOT_FOUND: {
    code: 'CHAT-E001',
    message: '해당 채팅방을 찾을 수 없습니다.',
    statusCode: 404,
    exampleTitle: '존재하지 않는 채팅방',
    exampleDescription: '삭제되었거나 존재하지 않는 채팅방 ID로 조회 요청한 경우',
  },
  INVALID_CHAT_REQUEST: {
    code: 'CHAT-E002',
    message: '요청 파라미터가 잘못되었습니다.',
    statusCode: 400,
    exampleTitle: '잘못된 메시지 전송 요청',
    exampleDescription: 'roomId 또는 senderId가 누락되었거나 형식이 잘못된 경우',
  },
  CHAT_MESSAGE_SAVE_FAILED: {
    code: 'CHAT-E003',
    message: '채팅 메시지 저장에 실패했습니다.',
    statusCode: 500,
    exampleTitle: '채팅 메시지 저장 실패',
    exampleDescription: '서버 내부 오류로 메시지를 저장하지 못한 경우',
  },
  CHAT_ROOM_NAME_CONFLICT: {
    code: 'CHAT-E004',
    message: '해당 팀에 동일한 이름의 채팅방이 이미 존재합니다.',
    statusCode: 409,
    exampleTitle: '채팅방 이름 중복',
    exampleDescription: '같은 팀 내에 동일한 이름의 채팅방이 존재할 때 발생합니다.',
  },
  CHAT_ROOM_ALREADY_JOINED: {
    code: 'CHAT-E005',
    message: '일부 유저는 이미 채팅방에 참여 중입니다.',
    statusCode: 409,
    exampleTitle: '중복 초대 요청',
    exampleDescription: '이미 채팅방에 있는 유저를 다시 초대하려 한 경우',
  },
  CHAT_ROOM_NOT_JOINED: {
    code: 'CHAT-E006',
    message: '해당 유저는 이 채팅방에 참여하지 않았습니다.',
    statusCode: 404,
    exampleTitle: '비참여자 메시지 요청',
    exampleDescription: '채팅방에 들어가지 않은 사용자가 메시지를 요청한 경우',
  },
  CHAT_USER_NOT_FOUND: {
    code: 'CHAT-E007',
    message: '해당 사용자가 속한 채팅방이 없습니다.',
    statusCode: 404,
    exampleTitle: '채팅방 없음',
    exampleDescription: 'userId로 조회했을 때 참여 중인 채팅방이 없는 경우',
  },
};
