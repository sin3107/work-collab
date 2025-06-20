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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const register_request_dto_1 = require("./dtos/request/register.request.dto");
const _common_1 = require("../../../../../libs/common/src");
const auth_errors_1 = require("../../../../../libs/error/src/constants/auth.errors");
const auth_success_1 = require("./response-defines/auth-success");
const jwt_guard_1 = require("./passport/guards/jwt.guard");
const user_errors_1 = require("../../../../../libs/error/src/constants/user.errors");
const jwt_refresh_guard_1 = require("./passport/guards/jwt-refresh.guard");
const login_request_dto_1 = require("./dtos/request/login.request.dto");
const local_guard_1 = require("./passport/guards/local-guard");
const social_guard_1 = require("./passport/guards/social.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async googleLogin() { }
    async googleRedirect(req) {
        const payload = req.user;
        return this.authService.socialLogin(payload);
    }
    async kakaoLogin() { }
    async kakaoRedirect(req) {
        const payload = req.user;
        return this.authService.socialLogin(payload);
    }
    async appleLogin() { }
    async appleRedirect(req) {
        const payload = req.user;
        return this.authService.socialLogin(payload);
    }
    async getMe(user) {
        return this.authService.getMe(user.id);
    }
    async logout(user) {
        return this.authService.logout(user.id);
    }
    async refresh(user, authorization) {
        const rawToken = authorization?.replace(/^Bearer\s/, '');
        return this.authService.refresh(user, rawToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, _common_1.SuccessResponse)(common_1.HttpStatus.CREATED, [auth_success_1.AuthSuccess['AUTH-S001']]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.CONFLICT, [auth_errors_1.AuthErrors.EMAIL_ALREADY_EXISTS]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.BAD_REQUEST, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_request_dto_1.RegisterRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_guard_1.LocalGuard),
    (0, _common_1.SuccessResponse)(common_1.HttpStatus.OK, [auth_success_1.AuthSuccess['AUTH-S002']]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [
        auth_errors_1.AuthErrors.INVALID_CREDENTIALS, auth_errors_1.AuthErrors.AUTH_NOT_FOUND
    ]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED]),
    (0, swagger_1.ApiBody)({ type: login_request_dto_1.LoginRequestDTO }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(social_guard_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)(social_guard_1.GoogleAuthGuard),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [auth_errors_1.AuthErrors.AUTH_NOT_FOUND,]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleRedirect", null);
__decorate([
    (0, common_1.Get)('kakao/login'),
    (0, common_1.UseGuards)(social_guard_1.KakaoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)('kakao/redirect'),
    (0, common_1.UseGuards)(social_guard_1.KakaoAuthGuard),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [auth_errors_1.AuthErrors.AUTH_NOT_FOUND,]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoRedirect", null);
__decorate([
    (0, common_1.Get)('apple/login'),
    (0, common_1.UseGuards)(social_guard_1.AppleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleLogin", null);
__decorate([
    (0, common_1.Get)('apple/redirect'),
    (0, common_1.UseGuards)(social_guard_1.AppleAuthGuard),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [auth_errors_1.AuthErrors.AUTH_NOT_FOUND,]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleRedirect", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, _common_1.SuccessResponse)(common_1.HttpStatus.OK, [auth_success_1.AuthSuccess['AUTH-S003']]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [user_errors_1.UserErrors.USER_NOT_FOUND]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED]),
    __param(0, (0, _common_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, _common_1.SuccessResponse)(common_1.HttpStatus.OK, [auth_success_1.AuthSuccess['AUTH-S004']]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [user_errors_1.UserErrors.USER_NOT_FOUND]),
    __param(0, (0, _common_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshAuthGuard),
    (0, _common_1.SuccessResponse)(common_1.HttpStatus.OK, [auth_success_1.AuthSuccess['AUTH-S005']]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.UNAUTHORIZED, [
        auth_errors_1.AuthErrors.INVALID_REFRESH_TOKEN,
        auth_errors_1.AuthErrors.USER_STATUS_RESTRICTED,
        auth_errors_1.AuthErrors.AUTH_NOT_FOUND,
    ]),
    (0, _common_1.ErrorResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED]),
    __param(0, (0, _common_1.CurrentUser)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map