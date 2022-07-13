type Falsy = false | 0 | "" | null | undefined;

type NonFalsy<T> = T extends Falsy ? never : T;

/**
 * Filter for falsy entries in an array
 *
 * Ex: array.filter(isTruthy)
 */
export function isTruthy<T>(value: T): value is NonFalsy<T> {
  return Boolean(value);
}
