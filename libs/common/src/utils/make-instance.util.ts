import { ApiPropertyOptions } from '@nestjs/swagger';

const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

function isObject(value: any) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

function isFunction(value: any): value is Function {
  return isObject(value);
}

function isLazyTypeFunc(type: Function | Type<unknown>): type is { type: Function } & Function {
  return isFunction(type) && type.name === 'type';
}

function isPrimitiveType(
  type: string | Function | Type<unknown> | [Function] | Record<string, any> | undefined,
): boolean {
  return typeof type === 'function' && [String, Boolean, Number].includes(type as any);
}

function checkType(object: any): object is Type {
  return object;
}

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string;
};

export function makeInstanceByApiProperty<T>(dtoClass: Type, generic?: Type): T {
  const mappingDto = {};
  const propertiesArray: string[] =
    Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];

  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map((field) => {
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
      } else if (typeof propertyType === 'string' || isPrimitiveType(propertyType)) {
        mappingDto[property.fieldName] =
          typeof property.example !== 'undefined' ? property.example : property.description;
      } else if (isLazyTypeFunc(propertyType as Function | Type<unknown>)) {
        const constructorType = (propertyType as Function)();
        if (Array.isArray(constructorType)) {
          mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType[0])];
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [makeInstanceByApiProperty(constructorType)];
        } else {
          mappingDto[property.fieldName] = makeInstanceByApiProperty(constructorType);
        }
      } else if (checkType(propertyType)) {
        mappingDto[property.fieldName] = property.isArray
          ? [makeInstanceByApiProperty(propertyType)]
          : makeInstanceByApiProperty(propertyType);
      }
    }
  }

  return mappingDto as T;
}
