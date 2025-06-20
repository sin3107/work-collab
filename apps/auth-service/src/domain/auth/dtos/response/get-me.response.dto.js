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
exports.GetMeResponseDTO = void 0;
const _common_1 = require("../../../../../../../libs/common/src");
const swagger_1 = require("@nestjs/swagger");
class GetMeResponseDTO {
}
exports.GetMeResponseDTO = GetMeResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetMeResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], GetMeResponseDTO.prototype, "birth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: _common_1.Provider }),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: _common_1.UserStatus }),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: _common_1.UserRole }),
    __metadata("design:type", String)
], GetMeResponseDTO.prototype, "role", void 0);
//# sourceMappingURL=get-me.response.dto.js.map