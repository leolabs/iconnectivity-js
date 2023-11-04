import { describe, expect, it } from "vitest";
import { DevSesnVal } from "./dev-sesn-val";
import { ParmVal } from "../data-blocks/parm-val";
import { splitNumber } from "../util";

const TEST_DATA = [
  ...[0x41, 0x01], // message class, data class
  0x01, // NumDataBlock: (1)
  ...[0x14, 0x03], // data block #1: size (20), type (ParmVal)
  0x04, // NumParmValBlock: (4)
  0x04, // block #1: ParmSize: (4)
  0x10, // block #1: ParmID: (0x10)
  ...[0x02, 0x00], // block #1: ParmVal: (256)
  0x04, // block #2: ParmSize: (4)
  0x11, // block #2: ParmID: (0x11)
  ...[0x02, 0x00], // block #2: ParmVal: (256)
  0x03, // block #3: ParmSize: (3)
  0x12, // block #3: ParmID: (0x12)
  0x01, // block #3: ParmVal: (1)
  0x06, // block #4: ParmSize: (6)
  0x13, // block #4: ParmID: (0x13)
  ...[0x01, 0x02, 0x03, 0x04], // block #4: ParmVal: (0x01020304)
];

describe("DevSesnVal Message", () => {
  it("should return the proper data", () => {
    const msg = new DevSesnVal([
      new ParmVal([
        { id: 0x10, data: splitNumber(256) },
        { id: 0x11, data: splitNumber(256) },
        { id: 0x12, data: [1] },
        { id: 0x13, data: [1, 2, 3, 4] },
      ]),
    ]);
    expect(msg.toData()).toEqual(TEST_DATA);
  });

  it("should properly parse a DevSesnVal message from bytes", () => {
    const result = DevSesnVal.fromData(TEST_DATA);
    expect(result.parmVals.length).toBe(1);
    expect(result.parmVals[0].values.length).toBe(4);
  });
});
