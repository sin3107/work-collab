import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorCommonResponse } from '@error/dtos/error-common-response.dto';
import { HttpExceptionErrorResponseDto } from '@error/dtos/http-exception-error-response.dto';
import { makeInstanceByApiProperty } from '@common/utils/make-instance.util';

export interface ErrorResponseOption {
  exampleTitle: string;
  exampleDescription: string;
  message: string;
  statusCode: number;
  code: string;
}

export const ErrorResponse = (
  statusCode: HttpStatus,
  errorResponseOptions: (ErrorResponseOption & { code: string })[],
) => {
  const examples = errorResponseOptions.reduce((acc, error) => {
    const innerErrorDto = {
      statusCode,
      error: error.exampleTitle,
      message: error.message,
      code: error.code,
    };

    const commonErrorInstance = makeInstanceByApiProperty<ErrorCommonResponse<any>>(ErrorCommonResponse);
    commonErrorInstance.error = innerErrorDto;

    acc[error.exampleTitle] = {
      value: commonErrorInstance,
      description: error.exampleDescription,
    };
    return acc;
  }, {});

  return applyDecorators(
    ApiExtraModels(ErrorCommonResponse, HttpExceptionErrorResponseDto),
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: {
            $ref: getSchemaPath(ErrorCommonResponse),
          },
          examples,
        },
      },
    }),
  );
};