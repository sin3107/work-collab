"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInstanceByApiProperty = makeInstanceByApiProperty;
const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;
function isObject(value) {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}
function isFunction(value) {
    return isObject(value);
}
function isLazyTypeFunc(type) {
    return isFunction(type) && type.name === 'type';
}
function isPrimitiveType(type) {
    return typeof type === 'function' && [String, Boolean, Number].includes(type);
}
function checkType(object) {
    return object;
}
function makeInstanceByApiProperty(dtoClass, generic) {
    const mappingDto = {};
    const propertiesArray = Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];
    const properties = propertiesArray.map((field) => {
        const fieldName = field.substring(1);
        const obj = Reflect.getMetadata(API_MODEL_PROPERTIES, dtoClass.prototype, fieldName);
        obj.fieldName = fieldName;
        return obj;
    });
    for (const property of properties) {
        const propertyType = property.type;
        if (propertyType) {
            if (propertyType === 'object') {
                mappingDto[property.fieldName] = generic
                    ? property.isArray
                        ? [makeInstanceByApiProperty(generic)]
                        : makeInstanceByApiProperty(generic)
                    : {};
            }
            else if (typeof propertyType === 'string' || isPrimitiveType(propertyType)) {
                mappingDto[property.fieldName] =
                    typeof property.example !== 'undefined' ? property.example : property.description;
            }
            else if (isLazyTypeFunc(propertyType)) {
                const constructorType = propertyType();
                if (Array.isArray(constructorType)) {
                    mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType[0])];
                }
                else if (property.isArray) {
                    mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType)];
                }
                else {
                    mappingDto[property.fieldName] = makeInstanceByApiProperty(constructorType);
                }
            }
            else if (checkType(propertyType)) {
                mappingDto[property.fieldName] = property.isArray
                    ? [makeInstanceByApiProperty(propertyType)]
                    : makeInstanceByApiProperty(propertyType);
            }
        }
    }
    return mappingDto;
}
//# sourceMappingURL=make-instance.util.js.map