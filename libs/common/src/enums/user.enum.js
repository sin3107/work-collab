"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.UserStatus = exports.Provider = void 0;
var Provider;
(function (Provider) {
    Provider["Local"] = "Local";
    Provider["Naver"] = "Naver";
    Provider["Kakao"] = "Kakao";
    Provider["Google"] = "Google";
    Provider["Apple"] = "Apple";
})(Provider || (exports.Provider = Provider = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "Active";
    UserStatus["Restriction"] = "Restriction";
    UserStatus["Withdrawal"] = "Withdrawal";
    UserStatus["Suspended"] = "Suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "User";
    UserRole["Admin"] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=user.enum.js.map