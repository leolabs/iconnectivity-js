import { describe, expect, it } from "vitest";
import { Parameter, ParmList } from "./parm-list";

const TEST_ARGS: Parameter[] = [4, 65];

describe("ParmList Data Block", () => {
  describe("fromData / toData", () => {
    it("should correctly parse a CmdVal block from bytes", () => {
      const block = [0x05, 0x01, 0x02, 0x04, 0x41];
      const cmdVal = ParmList.fromData(block);
      expect(cmdVal.parameters).toEqual(TEST_ARGS);
      expect(cmdVal.toData()).toEqual(block);
    });
  });
});
