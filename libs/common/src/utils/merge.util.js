"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjects = void 0;
const mergeObjects = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }
    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                (0, exports.mergeObjects)(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        });
    }
    return (0, exports.mergeObjects)(target, ...sources);
};
exports.mergeObjects = mergeObjects;
const isObject = (item) => {
    return item !== null && typeof item === 'object';
};
const isMergebleObject = (item) => {
    return isObject(item) && !Array.isArray(item);
};
//# sourceMappingURL=merge.util.js.map