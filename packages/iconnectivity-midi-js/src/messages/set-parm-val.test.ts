import { describe, expect, it } from "vitest";
import { DataClassType } from "../data-classes";
import { SetParmVal } from "./set-parm-val";
import { ArgVal, ArgValId } from "../data-blocks/arg-val";
import { ParmVal } from "../data-blocks/parm-val";

describe("SetParmVal Message", () => {
  it("should return the proper data", () => {
    const msg = new SetParmVal(
      DataClassType.DeviceInfo,
      new ArgVal([{ id: ArgValId.AreaId, value: 1 }]),
      [
        new ParmVal([
          { id: 4, data: [9] },
          { id: 65, data: [1, 2] },
        ]),
      ]
    );
    expect(msg.toData()).toEqual([
      ...[0x10, 0x02], // message class, data class
      0x02, // NumDataBlock: (2)
      ...[0x05, 0x04], // data block #1: size (5), type (ArgVal)
      0x01, // NumArgValBlock: (1)
      0x01, // block #1: ArgID: (1)
      0x01, // block #1: ArgVal: (1)
      ...[0x0a, 0x03], // data block #2: size (10), type (ParmVal)
      0x02, // NumParmValBlock: (2)
      0x03, // block #1: ParmSize: (3)
      0x04, // block #1: ParmID: (4)
      0x09, // block #1: ParmVal: (9)
      0x04, // block #2: ParmSize: (4)
      0x41, // block #2: ParmID: (65)
      ...[0x01, 0x02], // block #2: ParmVal: (0x0102)
    ]);
  });
});
