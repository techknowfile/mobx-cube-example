import { isObservableObject, defineProperty as mobxDefineProperty} from "mobx";

const plainObjectString = Object.toString();
export const EMPTY_ARRAY = Object.freeze([]);

export function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto == null) return true;
  return proto.constructor?.toString() === plainObjectString;
}

export function fail(message = "Illegal state") {
  return new Error("[mobx-cube] " + message);
}

export function warn(message) {
  return new Error("[mobx-cube] " + message);
}

export function defineProperty(object, key, descriptor) {
  isObservableObject(object)
    ? mobxDefineProperty(object, key, descriptor)
    : Object.defineProperty(object, key, descriptor);
}

/**
 * @internal
 * @hidden
 */
export function addHiddenFinalProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value
  });
}

export function isPrimitive(test) {
  return test !== Object(test);
}
