import type { AnyObject } from "./types";

function isRecord(object: unknown): object is AnyObject {
  return (
    object !== null &&
    object !== undefined &&
    typeof object === "object" &&
    !Array.isArray(object)
  );
}
function objectKeys<TObj extends AnyObject>(object: TObj) {
  return Object.keys(object) as (keyof TObj)[];
}

export function formatColorPrefix(prefix: string | undefined) {
  return `${prefix === undefined ? "color" : prefix}${
    prefix === "" ? "" : "-"
  }`;
}

export function deepMerge<Target extends AnyObject, Source extends AnyObject>(
  target: Target,
  ...sources: Source[]
): Target & Source {
  let output = Object.assign({}, target);
  sources.forEach((source) => {
    objectKeys(source).forEach((key) => {
      if (!isRecord(source[key]) || !isRecord(output[key])) {
        output[key] = source[key];
      } else {
        output[key] = deepMerge(output[key], source[key]);
      }
    });
  });
  return output;
}
export function mapObject<
  TObj extends Record<PropertyKey, any>,
  TReturn extends any
>(
  obj: TObj,
  {
    key,
    value,
  }: Partial<{
    key: (key: keyof TObj, value: TObj[keyof TObj]) => PropertyKey;
    value: (value: TObj[keyof TObj], key: keyof TObj) => TReturn;
  }>
) {
  return Object.entries(obj).reduce(
    (acc, [objKey, objValue]) => ({
      ...acc,
      [key?.(objKey, objValue) || objKey]:
        value?.(objValue, objKey) || objValue,
    }),
    {}
  );
}
