import { describe, expect, it } from "vitest";
import { SetCmdVal } from "./set-cmd-val";
import { CmdVal } from "../data-blocks/cmd-val";
import { Command } from "../commands";

describe("SetCmdVal Message", () => {
  it("should return the proper data", () => {
    const msg = new SetCmdVal([
      new CmdVal([
        { id: Command.BulkRequest, value: 9 },
        { id: Command.Notification, value: 7, args: [1] },
      ]),
    ]);
    expect(msg.toData()).toEqual([
      ...[0x11, 0x00], // message class, data class
      0x01, // NumDataBlock: (1),
      ...[0x0a, 0x06], // data block #1: size (10), type (CmdVal)
      0x02, // NumCmdValBlock: (2)
      0x03, // block #1: CmdSize: (3)
      0x04, // block #1: CmdID: (4)
      0x09, // block #1: CmdVal: (9)
      0x04, // block #2: CmdSize: (4)
      0x05, // block #2: CmdID: (5)
      0x07, // block #2: CmdVal: (7)
      0x01, // block #2: CmdArg 1: (1)
    ]);
  });
});
