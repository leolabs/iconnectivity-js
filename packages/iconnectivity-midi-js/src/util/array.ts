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

export type OneOrMore<T> = [T, ...T[]];

export function assertOneOrMore<T>(
  array: T[],
  msg: string
): asserts array is OneOrMore<T> {
  if (array.length === 0) {
    throw new Error(msg);
  }
}
