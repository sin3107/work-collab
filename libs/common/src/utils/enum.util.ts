const StringIsNumber = (value: string): boolean => isNaN(Number(value)) === false;

export function EnumToArray(enumObj: object): string[] {
  return Object.keys(enumObj)
    .filter((key) => StringIsNumber(enumObj[key]))
    .map((key) => enumObj[key]);
}
