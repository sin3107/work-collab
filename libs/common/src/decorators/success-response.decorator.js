"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const success_common_response_dto_1 = require("../dtos/success-common-response.dto");
const make_instance_util_1 = require("../utils/make-instance.util");
const _common_1 = require("..");
const SuccessResponse = (StatusCode, successResponseOptions) => {
    if (!Array.isArray(successResponseOptions) || successResponseOptions.length === 0) {
        throw new Error('successResponseOptions must be a non-empty array');
    }
    successResponseOptions.forEach((response) => {
        if (!response || !response.model) {
            throw new Error('Each successResponseOptions item must have a valid model property');
        }
    });
    const examples = successResponseOptions
        .map((response) => {
        const commonResponseInstance = (0, make_instance_util_1.makeInstanceByApiProperty)(success_common_response_dto_1.SuccessCommonResponseDto);
        const DtoModel = response.model;
        const dtoData = (0, make_instance_util_1.makeInstanceByApiProperty)(DtoModel, response.generic);
        if (response.overwriteValue) {
            commonResponseInstance.data = (0, _common_1.mergeObjects)({}, dtoData, response.overwriteValue);
        }
        else {
            commonResponseInstance.data = dtoData;
        }
        return {
            [response.exampleTitle]: {
                value: commonResponseInstance,
                description: response.exampleDescription,
            },
        };
    })
        .reduce((result, item) => Object.assign(result, item), {});
    const extraModels = successResponseOptions.map((e) => e.model);
    const uniqueModels = [...new Set(extraModels)];
    const extraGenericModels = successResponseOptions
        .map((e) => e.generic)
        .filter(Boolean);
    const uniqueGenericModels = [...new Set(extraGenericModels)];
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...uniqueModels, ...uniqueGenericModels, success_common_response_dto_1.SuccessCommonResponseDto), (0, swagger_1.ApiResponse)({
        status: StatusCode,
        content: {
            'application/json': {
                schema: {
                    additionalProperties: { $ref: (0, swagger_1.getSchemaPath)(success_common_response_dto_1.SuccessCommonResponseDto) },
                    oneOf: [...uniqueModels.map((e) => ({ $ref: (0, swagger_1.getSchemaPath)(e) })),
                        ...uniqueGenericModels.map((e) => ({ $ref: (0, swagger_1.getSchemaPath)(e) }))],
                },
                examples,
            },
        },
    }));
};
exports.SuccessResponse = SuccessResponse;
//# sourceMappingURL=success-response.decorator.js.map