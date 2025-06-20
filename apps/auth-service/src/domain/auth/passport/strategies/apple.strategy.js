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
exports.AppleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_apple_1 = require("passport-apple");
const config_1 = require("@nestjs/config");
const _common_1 = require("../../../../../../../libs/common/src");
let AppleStrategy = class AppleStrategy extends (0, passport_1.PassportStrategy)(passport_apple_1.Strategy, 'apple') {
    constructor(configService) {
        super({
            clientID: configService.get('APPLE_CLIENT_ID'),
            teamID: configService.get('APPLE_TEAM_ID'),
            keyID: configService.get('APPLE_KEY_ID'),
            privateKey: configService.get('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
            callbackURL: configService.get('APPLE_CALLBACK_URL'),
            passReqToCallback: false,
            scope: ['name', 'email'],
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, idToken, profile, done) {
        const user = {
            provider: _common_1.Provider.Apple,
            providerId: idToken.sub,
            email: idToken.email,
            name: profile?.name || null,
        };
        done(null, user);
    }
};
exports.AppleStrategy = AppleStrategy;
exports.AppleStrategy = AppleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppleStrategy);
//# sourceMappingURL=apple.strategy.js.map