import { describe, expect, it } from "vitest";
import { ArgVal, ArgValId, ArgumentValue } from "./arg-val";

const TEST_ARGS: ArgumentValue[] = [
  { id: ArgValId.AreaId, value: 0 },
  { id: ArgValId.SceneId, value: 1 },
];

describe("ArgVal Data Block", () => {
  describe("fromData / toData", () => {
    it("should correctly parse a ParmDef block from bytes", () => {
      const block = [0x07, 0x04, 0x02, 0x01, 0x00, 0x02, 0x01];
      const parmDef = ArgVal.fromData(block);
      expect(parmDef.values).toEqual(TEST_ARGS);
      expect(parmDef.toData()).toEqual(block);
    });
  });
});
