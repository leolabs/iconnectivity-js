/**
 * Creates a bitmap from a list of values.
 * Any truthy value is treated as a 1, the rest as 0.
 */
export const makeBitmap = (...values: Array<boolean | null | undefined>) => {
  let bitmap = 0;
  for (let i = 0; i < values.length; i++) {
    bitmap |= (values[i] ? 1 : 0) << (values.length - i - 1);
  }
  return bitmap;
};

/** Converts a bitmap back to an array of values */
export const bitmapToArray = (bitmap: number, maxLength = 8) => {
  const array = [];
  for (let i = maxLength - 1; i >= 0; i--) {
    array.push(!!(bitmap & (1 << i)));
  }
  return array;
};
