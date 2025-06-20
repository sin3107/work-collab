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
exports.ValidationErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ValidationErrorResponseDto {
    constructor(message) {
        this.statusCode = 400;
        this.error = 'ValidationException';
        this.message = message;
    }
}
exports.ValidationErrorResponseDto = ValidationErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ValidationErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ValidationException' }),
    __metadata("design:type", String)
], ValidationErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            email: ['이메일 형식이 잘못되었습니다.'],
        },
    }),
    __metadata("design:type", Object)
], ValidationErrorResponseDto.prototype, "message", void 0);
//# sourceMappingURL=validation-error-response.dto.js.map