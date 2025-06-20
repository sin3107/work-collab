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
exports.SafeHttpService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const _error_1 = require("../../../error/src");
let SafeHttpService = class SafeHttpService {
    constructor(httpService, errorService) {
        this.httpService = httpService;
        this.errorService = errorService;
    }
    async get(url, onError) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url).pipe((0, operators_1.retry)(2)));
            return data;
        }
        catch (err) {
            this.throwFormattedError(err, onError);
        }
    }
    async post(url, body, onError) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, body).pipe((0, operators_1.retry)(2)));
            return data;
        }
        catch (err) {
            this.throwFormattedError(err, onError);
        }
    }
    throwFormattedError(error, onError) {
        const axiosError = error;
        if (typeof onError === 'function') {
            const result = onError(axiosError);
            if (result === null) {
                return null;
            }
            this.errorService.throw(result);
        }
        this.errorService.throw(onError);
    }
};
exports.SafeHttpService = SafeHttpService;
exports.SafeHttpService = SafeHttpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        _error_1.ErrorService])
], SafeHttpService);
//# sourceMappingURL=safe-http.service.js.map