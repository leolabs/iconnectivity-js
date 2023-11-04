import { describe, expect, it } from "vitest";
import { Command } from "../commands";
import { CmdVal, CommandValue } from "./cmd-val";

const TEST_ARGS: CommandValue[] = [
  { id: Command.BulkRequest, value: 9, args: [] },
  { id: Command.Notification, value: 7, args: [1, 8] },
];

describe("CmdVal Data Block", () => {
  describe("fromData / toData", () => {
    it("should correctly parse a CmdVal block from bytes", () => {
      const block = [
        0x0b, 0x06, 0x02, 0x03, 0x04, 0x09, 0x05, 0x05, 0x07, 0x01, 0x08,
      ];
      const cmdVal = CmdVal.fromData(block);
      expect(cmdVal.values).toEqual(TEST_ARGS);
      expect(cmdVal.toData()).toEqual(block);
    });
  });
});
