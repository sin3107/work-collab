"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSuccess = void 0;
const register_response_dto_1 = require("../dtos/response/register.response.dto");
const login_response_dto_1 = require("../dtos/response/login.response.dto");
const get_me_response_dto_1 = require("../dtos/response/get-me.response.dto");
const _common_1 = require("../../../../../../libs/common/src");
exports.AuthSuccess = {
    'AUTH-S001': {
        model: register_response_dto_1.UserRegisterResponseDTO,
        exampleTitle: '회원가입 성공',
        exampleDescription: '회원가입이 정상적으로 완료되었습니다.',
        code: 'AUTH-S001',
    },
    'AUTH-S002': {
        model: login_response_dto_1.LoginResponseDTO,
        exampleTitle: '로그인 성공',
        exampleDescription: '로그인이 정상적으로 완료되었습니다.',
        code: 'AUTH-S002',
    },
    'AUTH-S003': {
        model: get_me_response_dto_1.GetMeResponseDTO,
        exampleTitle: '내 정보 조회 성공',
        exampleDescription: '내 정보가 정상적으로 조회되었습니다.',
        code: 'AUTH-S003',
    },
    'AUTH-S004': {
        model: _common_1.VoidResponseDTO,
        exampleTitle: '로그아웃 성공',
        exampleDescription: '정상적으로 로그아웃되었습니다.',
        code: 'AUTH-S004',
    },
    'AUTH-S005': {
        model: login_response_dto_1.LoginResponseDTO,
        exampleTitle: 'RefreshToken 재발급 성공',
        exampleDescription: 'AccessToken과 RefreshToken이 재발급되었습니다.',
        code: 'AUTH-S005',
    },
};
//# sourceMappingURL=auth-success.js.map