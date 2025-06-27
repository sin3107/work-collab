import { ErrorResponseOption } from '@common';


export type FileErrorKeys =
  | 'FILE_NOT_FOUND'
  | 'FILE_UPLOAD_FAILED'
  | 'FILE_DELETE_FAILED'
  | 'INVALID_FILE_TYPE'
  | 'FILE_SERVICE_COMMUNICATION_FAILED';

export const FileErrors: Record<FileErrorKeys, ErrorResponseOption> = {
  FILE_NOT_FOUND: {
    exampleTitle: '파일 없음',
    exampleDescription: '요청한 파일을 찾을 수 없습니다.',
    message: '파일이 존재하지 않습니다.',
    statusCode: 404,
    code: 'FILE-E001',
  },
  FILE_UPLOAD_FAILED: {
    exampleTitle: '파일 업로드 실패',
    exampleDescription: '파일 업로드에 실패했습니다.',
    message: '파일 업로드 중 오류가 발생했습니다.',
    statusCode: 500,
    code: 'FILE-E002',
  },
  FILE_DELETE_FAILED: {
    exampleTitle: '파일 삭제 실패',
    exampleDescription: '파일 삭제에 실패했습니다.',
    message: '파일 삭제 중 오류가 발생했습니다.',
    statusCode: 500,
    code: 'FILE-E003',
  },
  INVALID_FILE_TYPE: {
    exampleTitle: '허용되지 않은 파일 유형',
    exampleDescription: '이 파일 유형은 업로드할 수 없습니다.',
    message: '지원하지 않는 파일 형식입니다.',
    statusCode: 400,
    code: 'FILE-E004',
  },
  FILE_SERVICE_COMMUNICATION_FAILED: {
    exampleTitle: '파일 서비스 통신 오류',
    exampleDescription: '파일 서비스와의 통신에 실패했습니다.',
    message: '파일 서비스를 사용할 수 없습니다.',
    statusCode: 502,
    code: 'FILE-E050',
  },
};