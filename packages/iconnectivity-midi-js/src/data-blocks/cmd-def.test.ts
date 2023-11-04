import { describe, expect, it } from "vitest";
import { CmdDef, CommandDefinition } from "./cmd-def";
import { Command } from "../commands";

const TEST_ARGS: CommandDefinition[] = [
  { id: Command.BulkRequest, data: [9] },
  { id: Command.Notification, data: [7, 9] },
];

describe("CmdDef Data Block", () => {
  describe("fromData / toData", () => {
    it("should correctly parse a CmdDef block from bytes", () => {
      const block = [
        0x0a, 0x05, 0x02, 0x03, 0x04, 0x09, 0x04, 0x05, 0x07, 0x09,
      ];
      const cmdDef = CmdDef.fromData(block);
      expect(cmdDef.definitions).toEqual(TEST_ARGS);
      expect(cmdDef.toData()).toEqual(block);
    });
  });
});
