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
exports.JwtRefreshStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const _error_1 = require("../../../../../../../libs/error/src");
const auth_errors_1 = require("../../../../../../../libs/error/src/constants/auth.errors");
const auth_repository_1 = require("../../auth.repository");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh-token') {
    constructor(configService, authRepository, errorService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: async (_, rawJwtToken, done) => {
                try {
                    const secret = configService.get('REFRESH_TOKEN_SECRET');
                    done(null, secret);
                }
                catch (err) {
                    done(err, null);
                }
            },
        });
        this.configService = configService;
        this.authRepository = authRepository;
        this.errorService = errorService;
    }
    async validate(payload) {
        const auth = await this.authRepository.findByUserId(payload.id);
        if (!auth || !auth.refreshToken) {
            this.errorService.throw(auth_errors_1.AuthErrors.INVALID_REFRESH_TOKEN);
        }
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_repository_1.AuthRepository,
        _error_1.ErrorService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt-refresh.strategy.js.map