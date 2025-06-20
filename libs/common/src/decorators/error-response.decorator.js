"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _error_1 = require("../../../error/src");
const _error_2 = require("../../../error/src");
const make_instance_util_1 = require("../utils/make-instance.util");
const ErrorResponse = (statusCode, errorResponseOptions) => {
    const examples = errorResponseOptions.reduce((acc, error) => {
        const innerErrorDto = {
            statusCode,
            error: error.exampleTitle,
            message: error.message,
            code: error.code,
        };
        const commonErrorInstance = (0, make_instance_util_1.makeInstanceByApiProperty)(_error_1.ErrorCommonResponse);
        commonErrorInstance.error = innerErrorDto;
        acc[error.exampleTitle] = {
            value: commonErrorInstance,
            description: error.exampleDescription,
        };
        return acc;
    }, {});
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(_error_1.ErrorCommonResponse, _error_2.HttpExceptionErrorResponseDto), (0, swagger_1.ApiResponse)({
        status: statusCode,
        content: {
            'application/json': {
                schema: {
                    $ref: (0, swagger_1.getSchemaPath)(_error_1.ErrorCommonResponse),
                },
                examples,
            },
        },
    }));
};
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=error-response.decorator.js.map