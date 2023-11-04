import { describe, expect, it } from "vitest";
import { RetParmDef } from "./ret-parm-def";
import { DataClassType } from "../data-classes";
import { ParmDef } from "../data-blocks/parm-def";

const TEST_DATA = [
  ...[0x42, 0x01], // message class, data class
  0x01, // NumDataBlock: (1)
  ...[0x0b, 0x02], // data block #1: size (11), type (ParmDef)
  0x04, // NumParmDefBlock: (4)
  ...[0x04, 0x00], // block #1: ID = 4, flags = RDGT
  ...[0x07, 0x02], // block #2: ID = 7, flags = RCGT
  ...[0x09, 0x0d], // block #3: ID = 9, flags = WNPS
  ...[0x05, 0x03], // block #4: ID = 5, flags = WBGT
];

describe("RetParmDef Message", () => {
  it("should return the proper data", () => {
    const msg = new RetParmDef(DataClassType.SessionInfo, [
      new ParmDef([
        {
          id: 4,
          readOnly: true,
          type: "dynamic",
          scope: "global",
          scene: false,
        },
        {
          id: 7,
          readOnly: true,
          type: "constant",
          scope: "global",
          scene: false,
        },
        {
          id: 9,
          readOnly: false,
          type: "normal",
          scope: "preset",
          scene: true,
        },
        {
          id: 5,
          readOnly: false,
          type: "reboot",
          scope: "global",
          scene: false,
        },
      ]),
    ]);
    expect(msg.toData()).toEqual(TEST_DATA);
  });

  it("should properly parse a DevSesnVal message from bytes", () => {
    const result = RetParmDef.fromData(TEST_DATA);
    expect(result.parmDefs.length).toBe(1);
    expect(result.parmDefs[0].definitions.length).toBe(4);
    expect(result.toData()).toEqual(TEST_DATA);
  });
});
