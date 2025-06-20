"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCommonResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enum_util_1 = require("../../../common/src/utils/enum.util");
class ErrorCommonResponse {
}
exports.ErrorCommonResponse = ErrorCommonResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: (0, enum_util_1.EnumToArray)(common_1.HttpStatus), description: '상태코드' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ErrorCommonResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: '성공여부' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ErrorCommonResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: '에러 발생시간' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ErrorCommonResponse.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: '에러 발생 url' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ErrorCommonResponse.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: '에러 발생 메소드' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ErrorCommonResponse.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        description: 'HttpExceptionErrorResponseDto 또는 ValidationErrorResponseDto 중 하나가 올 수 있습니다.',
        additionalProperties: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ErrorCommonResponse.prototype, "error", void 0);
//# sourceMappingURL=error-common-response.dto.js.map