import { test, expect } from "vitest";
import { getBit, mergeNumber, splitNumber } from "./number";

test("splitNumber", () => {
  expect(splitNumber(0x0000)).toEqual([0x00, 0x00]);
  expect(splitNumber(0x0003)).toEqual([0x00, 0x03]);
  expect(splitNumber(0x007f)).toEqual([0x00, 0x7f]);
  expect(splitNumber(0x0080)).toEqual([0x01, 0x00]);
  expect(splitNumber(0x0081)).toEqual([0x01, 0x01]);
  expect(splitNumber(0x1234)).toEqual([0x24, 0x34]);
  expect(splitNumber(0x2ca5)).toEqual([0x59, 0x25]);
});

test("mergeNumber", () => {
  expect(mergeNumber([0x00, 0x00])).toEqual(0x0000);
  expect(mergeNumber([0x00, 0x03])).toEqual(0x0003);
  expect(mergeNumber([0x00, 0x7f])).toEqual(0x007f);
  expect(mergeNumber([0x01, 0x00])).toEqual(0x0080);
  expect(mergeNumber([0x01, 0x01])).toEqual(0x0081);
  expect(mergeNumber([0x24, 0x34])).toEqual(0x1234);
  expect(mergeNumber([0x59, 0x25])).toEqual(0x2ca5);
});

test("getBit", () => {
  expect(getBit(0b0001, 0)).toBe(1);
  expect(getBit(0b0001, 1)).toBe(0);
  expect(getBit(0b0001, 2)).toBe(0);
  expect(getBit(0b0001, 3)).toBe(0);

  expect(getBit(0b0101, 0)).toBe(1);
  expect(getBit(0b0101, 1)).toBe(0);
  expect(getBit(0b0101, 2)).toBe(1);
  expect(getBit(0b0101, 3)).toBe(0);
});
