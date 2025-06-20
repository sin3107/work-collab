"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleAuthGuard = exports.KakaoAuthGuard = exports.GoogleAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class GoogleAuthGuard extends (0, passport_1.AuthGuard)('google') {
}
exports.GoogleAuthGuard = GoogleAuthGuard;
class KakaoAuthGuard extends (0, passport_1.AuthGuard)('kakao') {
}
exports.KakaoAuthGuard = KakaoAuthGuard;
class AppleAuthGuard extends (0, passport_1.AuthGuard)('apple') {
}
exports.AppleAuthGuard = AppleAuthGuard;
//# sourceMappingURL=social.guard.js.map