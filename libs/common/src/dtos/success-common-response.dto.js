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
exports.SuccessCommonResponseDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enum_util_1 = require("../utils/enum.util");
class SuccessCommonResponseDto {
}
exports.SuccessCommonResponseDto = SuccessCommonResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: (0, enum_util_1.EnumToArray)(common_1.HttpStatus), description: '상태코드', required: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SuccessCommonResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: '성공여부', required: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], SuccessCommonResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        oneOf: [{ type: 'object' }, { type: 'array' }],
        description: 'object 또는 array 형식의 응답데이타가 옵니다.',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SuccessCommonResponseDto.prototype, "data", void 0);
//# sourceMappingURL=success-common-response.dto.js.map