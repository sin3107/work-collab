import { SuccessResponseOption } from "@common";
import { UploadFileResponseDTO } from "../dtos/response/upload-file.response.dto";
import { DeleteFileResponseDTO } from "../dtos/response/delete-file.response.dto";
import { PresignUploadUrlResponseDTO } from "../dtos/response/presign-url.response.dto";

export type FileSuccessKeys =
  | 'FILE-S001'
  | 'FILE-S002'
  | 'FILE-S003'
  | 'FILE-S004';

export const FileSuccess: Record<FileSuccessKeys, SuccessResponseOption & { code: string }> = {
  'FILE-S001': {
    model: UploadFileResponseDTO,
    exampleTitle: '파일 업로드 성공',
    exampleDescription: '파일이 성공적으로 업로드되었습니다.',
    code: 'FILE-S001',
  },
  'FILE-S002': {
    model: undefined,
    exampleTitle: '파일 조회 성공',
    exampleDescription: '파일이 성공적으로 전송됩니다.',
    code: 'FILE-S002',
  },
  'FILE-S003': {
    model: DeleteFileResponseDTO,
    exampleTitle: '파일 삭제 성공',
    exampleDescription: '파일이 성공적으로 삭제되었습니다.',
    code: 'FILE-S002',
  },
  'FILE-S004': {
    model: PresignUploadUrlResponseDTO,
    exampleTitle: '업로드 URL 발급 성공',
    exampleDescription: '프론트엔드에서 직접 업로드할 수 있는 URL을 발급합니다.',
    code: 'FILE-S003',
  },
};
