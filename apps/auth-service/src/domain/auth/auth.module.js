"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const bcrypt_service_1 = require("../../infra/security/bcrypt.service");
const auth_repository_1 = require("./auth.repository");
const typeorm_1 = require("@nestjs/typeorm");
const auth_entity_1 = require("./entities/auth.entity");
const _error_1 = require("../../../../../libs/error/src");
const safe_http_module_1 = require("../../../../../libs/common/src/utils/safe-http.module");
const _bootstrap_1 = require("../../../../../libs/bootstrap/src");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 3000,
                maxRedirects: 5,
            }),
            typeorm_1.TypeOrmModule.forFeature([auth_entity_1.AuthEntity]),
            _bootstrap_1.GlobalJwtModule,
            _error_1.ErrorModule,
            safe_http_module_1.SafeHttpModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_repository_1.AuthRepository,
            bcrypt_service_1.BcryptService
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map