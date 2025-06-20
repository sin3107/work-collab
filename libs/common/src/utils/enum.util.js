"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumToArray = EnumToArray;
const StringIsNumber = (value) => isNaN(Number(value)) === false;
function EnumToArray(enumObj) {
    return Object.keys(enumObj)
        .filter((key) => StringIsNumber(enumObj[key]))
        .map((key) => enumObj[key]);
}
//# sourceMappingURL=enum.util.js.map