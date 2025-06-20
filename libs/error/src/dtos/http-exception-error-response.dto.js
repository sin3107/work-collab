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
exports.HttpExceptionErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class HttpExceptionErrorResponseDto {
}
exports.HttpExceptionErrorResponseDto = HttpExceptionErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '상태코드 (HTTP Status)',
        example: 400,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], HttpExceptionErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BadRequestException', description: '에러 타입' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], HttpExceptionErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '에러 메시지',
        example: '잘못된 요청입니다.',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], HttpExceptionErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '비즈니스 에러코드 (널값 가능)',
        nullable: true,
        example: 'Auth-E001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], HttpExceptionErrorResponseDto.prototype, "code", void 0);
//# sourceMappingURL=http-exception-error-response.dto.js.map