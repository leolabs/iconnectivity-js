import { describe, expect, it } from "vitest";
import {
  ParameterValue,
  ParmVal,
  bytesToParameterValue,
  parameterValueToBytes,
} from "./parm-val";

const TEST_DEFINITIONS: ParameterValue[] = [
  { id: 4, data: [0x09] },
  { id: 65, data: [0x01, 0x02] },
  { id: 5, data: [0x01, 0x03, 0x02, 0x08, 0x04, 0x09] },
];

describe("ParmVal Data Block", () => {
  describe("byteToDefinition", () => {
    it("should correctly convert bytes to the given definition", () => {
      expect(bytesToParameterValue([0x03, 0x04, 0x09])).toEqual(
        TEST_DEFINITIONS[0]
      );
    });
  });

  describe("definitionToBytes", () => {
    it("should correctly convert the given definition to two bytes", () => {
      expect(parameterValueToBytes(TEST_DEFINITIONS[0])).toEqual([
        0x03, 0x04, 0x09,
      ]);
    });
  });

  describe("fromData / toData", () => {
    it("should correctly parse a ParmVal block from bytes", () => {
      const block = [
        0x12,
        0x03,
        0x03,
        0x03,
        0x04,
        0x09,
        0x04,
        0x41,
        ...[0x01, 0x02],
        0x08,
        0x05,
        ...[0x01, 0x03],
        ...[0x02, 0x08],
        ...[0x04, 0x09],
      ];
      const parmDef = ParmVal.fromData(block);
      expect(parmDef.values).toEqual(TEST_DEFINITIONS);
      expect(parmDef.toData()).toEqual(block);
    });
  });
});
