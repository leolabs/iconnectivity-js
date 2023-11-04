import { describe, expect, it } from "vitest";
import { ParmDef, byteToDefinition, definitionToBytes } from "./parm-def";

const TEST_DEFINITIONS = [
  {
    id: 0x04,
    readOnly: true,
    type: "dynamic",
    scope: "global",
    scene: false,
  },
  {
    id: 0x07,
    readOnly: true,
    type: "constant",
    scope: "global",
    scene: false,
  },
  {
    id: 0x09,
    readOnly: false,
    type: "normal",
    scope: "preset",
    scene: true,
  },
  {
    id: 0x05,
    readOnly: false,
    type: "reboot",
    scope: "global",
    scene: false,
  },
] as const;

describe("ParmDef Data Block", () => {
  describe("byteToDefinition", () => {
    it("should correctly convert bytes to the given definition", () => {
      expect(byteToDefinition(0x04, 0x00)).toEqual(TEST_DEFINITIONS[0]);
      expect(byteToDefinition(0x07, 0x02)).toEqual(TEST_DEFINITIONS[1]);
      expect(byteToDefinition(0x09, 0x0d)).toEqual(TEST_DEFINITIONS[2]);
      expect(byteToDefinition(0x05, 0x03)).toEqual(TEST_DEFINITIONS[3]);
    });
  });

  describe("definitionToBytes", () => {
    it("should correctly convert the given definition to two bytes", () => {
      expect(definitionToBytes(TEST_DEFINITIONS[0])).toEqual([0x04, 0x00]);
      expect(definitionToBytes(TEST_DEFINITIONS[1])).toEqual([0x07, 0x02]);
      expect(definitionToBytes(TEST_DEFINITIONS[2])).toEqual([0x09, 0x0d]);
      expect(definitionToBytes(TEST_DEFINITIONS[3])).toEqual([0x05, 0x03]);
    });
  });

  describe("fromData / toData", () => {
    it("should correctly parse a ParmDef block from bytes", () => {
      const block = [
        0x0b,
        0x02,
        0x04,
        ...[0x04, 0x00],
        ...[0x07, 0x02],
        ...[0x09, 0x0d],
        ...[0x05, 0x03],
      ];
      const parmDef = ParmDef.fromData(block);
      expect(parmDef.definitions).toEqual(TEST_DEFINITIONS);
      expect(parmDef.toData()).toEqual(block);
    });
  });
});
