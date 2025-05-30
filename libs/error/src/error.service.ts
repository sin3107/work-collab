import { Injectable, HttpException } from '@nestjs/common';
import { ErrorResponseOption } from '@common';

@Injectable()
export class ErrorService {
  throw(error: ErrorResponseOption & { code: string }, statusCode: number = 400): never {
    throw new HttpException(
      {
        success: false,
        code: error.code,
        message: error.message,
      },
      error.statusCode,
    );
  }
}