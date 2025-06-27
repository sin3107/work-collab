import { PresignUploadUrlResponseDTO } from "./dtos/response/presign-url.response.dto";

export interface UploadedFileMeta {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export abstract class FileRepository {
  abstract upload(file: Express.Multer.File): Promise<UploadedFileMeta>;
  abstract delete(filename: string): Promise<void>;

  abstract getPresignedUploadUrl(
    type: string,
    ext: string,
  ): Promise<PresignUploadUrlResponseDTO>;
}