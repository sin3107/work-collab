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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_service_1 = require("../../infra/security/bcrypt.service");
const _error_1 = require("../../../../../libs/error/src");
const auth_errors_1 = require("../../../../../libs/error/src/constants/auth.errors");
const auth_repository_1 = require("./auth.repository");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const _common_1 = require("../../../../../libs/common/src");
let AuthService = class AuthService {
    constructor(bcryptService, errorService, authRepository, jwtService, configService, safeHttp) {
        this.bcryptService = bcryptService;
        this.errorService = errorService;
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.safeHttp = safeHttp;
    }
    async register(dto) {
        try {
            await this.safeHttp.get(`http://user-service:3001/users/email/${dto.email}`, (error) => {
                if (error.response?.status === 404) {
                    return null;
                }
                return auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
            });
            this.errorService.throw(auth_errors_1.AuthErrors.EMAIL_ALREADY_EXISTS);
        }
        catch { }
        const user = await this.safeHttp.post('http://user-service:3001/users', {
            email: dto.email,
            name: dto.name,
            phone: dto.phone,
            birth: dto.birth,
        }, (error) => {
            if (error.response?.status === 409) {
                return auth_errors_1.AuthErrors.EMAIL_ALREADY_EXISTS;
            }
            return auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
        });
        const hashedPassword = await this.bcryptService.hash(dto.password);
        await this.authRepository.createAuth(user.id, hashedPassword);
        const jwtPayload = { id: user.id, email: user.email, role: user.role };
        const refreshToken = this.generateRefreshToken(jwtPayload);
        const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);
        if (!updated) {
            this.errorService.throw(auth_errors_1.AuthErrors.AUTH_NOT_FOUND);
        }
        return user;
    }
    async login(user) {
        const jwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.generateAccessToken(jwtPayload);
        const refreshToken = this.generateRefreshToken(jwtPayload);
        const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);
        if (!updated) {
            this.errorService.throw(auth_errors_1.AuthErrors.AUTH_NOT_FOUND);
        }
        return { accessToken, refreshToken };
    }
    async socialLogin(payload) {
        let user;
        try {
            user = await this.safeHttp.get(`http://user-service:3001/users/provider/${payload.provider}/${payload.providerId}`, (error) => {
                if (error.response?.status === 404) {
                    return null;
                }
                return auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
            });
            if (!user) {
                user = await this.safeHttp.post(`http://user-service:3001/users/social`, payload, auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
            }
        }
        catch {
            this.errorService.throw(auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
        }
        const jwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.generateAccessToken(jwtPayload);
        const refreshToken = this.generateRefreshToken(jwtPayload);
        const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);
        if (!updated) {
            this.errorService.throw(auth_errors_1.AuthErrors.AUTH_NOT_FOUND);
        }
        return { accessToken, refreshToken };
    }
    async getMe(userId) {
        return await this.safeHttp.get(`http://user-service:3001/users/${userId}`, auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
    }
    async logout(userId) {
        await this.authRepository.removeRefreshToken(userId);
    }
    async refresh(user, presentedToken) {
        const auth = await this.authRepository.findByUserId(user.id);
        if (!auth || !auth.refreshToken) {
            this.errorService.throw(auth_errors_1.AuthErrors.INVALID_REFRESH_TOKEN);
        }
        if (auth.refreshToken !== presentedToken) {
            this.errorService.throw(auth_errors_1.AuthErrors.INVALID_REFRESH_TOKEN);
        }
        const userProfile = await this.safeHttp.get(`http://user-service:3001/users/${user.id}`, auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
        if (userProfile.status !== 'Active') {
            this.errorService.throw(auth_errors_1.AuthErrors.USER_STATUS_RESTRICTED);
        }
        const jwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.generateAccessToken(jwtPayload);
        const newRefreshToken = this.generateRefreshToken(jwtPayload);
        const updated = await this.authRepository.saveRefreshToken(user.id, newRefreshToken);
        if (!updated) {
            this.errorService.throw(auth_errors_1.AuthErrors.AUTH_NOT_FOUND);
        }
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload);
    }
    generateRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '14d'),
        });
    }
    async validateUser(email, password) {
        let user = null;
        try {
            user = await this.safeHttp.get(`http://user-service:3001/users/email/${email}`, (error) => {
                if (error.response?.status === 404) {
                    return null;
                }
                return auth_errors_1.AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
            });
        }
        catch {
            return null;
        }
        if (!user)
            return null;
        const auth = await this.authRepository.findByUserId(user.id);
        if (!auth || !(await this.bcryptService.compare(password, auth.password))) {
            return null;
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bcrypt_service_1.BcryptService,
        _error_1.ErrorService,
        auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService,
        _common_1.SafeHttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map