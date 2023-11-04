import { describe, expect, it } from "vitest";
import { RetCmdDef } from "./ret-cmd-def";
import { CmdDef } from "../data-blocks/cmd-def";
import { Command } from "../commands";

const TEST_DATA = [
  ...[0x44, 0x00], // message class, data class
  0x01, // NumDataBlock: (1)
  ...[0x0a, 0x05], // data block #1: size (10), type (CmdDef)
  0x02, // NumCmdDefBlock: (2)
  0x03, // block #1: CmdSize: (3)
  0x04, // block #1: CmdID: (4)
  0x09, // block #1: CmdVal: (9)
  0x04, // block #2: CmdSize: (4)
  0x05, // block #2: CmdID: (5)
  0x07, // block #2: CmdVal 1: (7)
  0x09, // block #2: CmdVal 2: (9)
];

describe("RetCmdDef Message", () => {
  it("should return the proper data", () => {
    const msg = new RetCmdDef([
      new CmdDef([
        { id: Command.BulkRequest, data: [9] },
        { id: Command.Notification, data: [7, 9] },
      ]),
    ]);
    expect(msg.toData()).toEqual(TEST_DATA);
  });

  it("should properly parse a DevSesnVal message from bytes", () => {
    const result = RetCmdDef.fromData(TEST_DATA);
    expect(result.cmdDefs.length).toBe(1);
    expect(result.cmdDefs[0].definitions.length).toBe(2);
    expect(result.toData()).toEqual(TEST_DATA);
  });
});
