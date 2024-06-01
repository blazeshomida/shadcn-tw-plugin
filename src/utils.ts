import type { AnyObject } from "./types";
import "culori/css";
import { converter, round as roundTo } from "culori/fn";

export const oklch = converter("oklch");
export const round = roundTo(2);

/**
 * Checks if a given object is a record (non-array, non-null, non-undefined object).
 *
 * @param object - The object to check.
 * @returns True if the object is a record, false otherwise.
 */
function isRecord(object: unknown): object is AnyObject {
  return (
    object !== null &&
    object !== undefined &&
    typeof object === "object" &&
    !Array.isArray(object)
  );
}

/**
 * Returns the keys of an object, typed to ensure they are valid for the given object type.
 *
 * @param object - The object to get the keys from.
 * @returns An array of keys of the object.
 */
function objectKeys<TObj extends AnyObject>(object: TObj) {
  return Object.keys(object) as (keyof TObj)[];
}

/**
 * Deeply merges multiple source objects into a target object.
 *
 * @param target - The target object to merge into.
 * @param sources - The source objects to merge from.
 * @returns The merged object.
 */
export function deepMerge<Target extends AnyObject, Source extends AnyObject>(
  target: Target,
  ...sources: Source[]
): Target & Source {
  const output = Object.assign({}, target);
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

/**
 * Maps over the properties of an object, allowing for transformations of keys and values via optional callback functions.
 *
 * @param obj - The object to map over.
 * @param key - Optional callback function to transform keys.
 * @param value - Optional callback function to transform values.
 * @returns A new object with transformed keys and values.
 */
export function mapObject<TObj extends AnyObject, TReturn>(
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
