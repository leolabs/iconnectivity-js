import { test, expect } from "vitest";
import { bitmapToArray, makeBitmap } from "./bitmap";

test("makeBitmap", () => {
  expect(makeBitmap(true, false, true, false)).toBe(0b1010);
  expect(makeBitmap(true, false, true, false, true)).toBe(0b10101);
  expect(makeBitmap(true, false, true, false, true, false)).toBe(0b101010);
});

test("bitmapToArray", () => {
  expect(bitmapToArray(0b101, 3)).toEqual([true, false, true]);
  expect(bitmapToArray(0b1010, 4)).toEqual([true, false, true, false]);
  expect(bitmapToArray(0b10101, 5)).toEqual([true, false, true, false, true]);
});
