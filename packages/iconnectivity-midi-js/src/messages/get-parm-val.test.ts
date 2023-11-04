import { describe, expect, it } from "vitest";
import { DataClassType } from "../data-classes";
import { GetParmVal } from "./get-parm-val";
import { ArgVal, ArgValId } from "../data-blocks/arg-val";
import { ParmList } from "../data-blocks/parm-list";

describe("GetParmVal Message", () => {
  it("should return the proper data", () => {
    const msg = new GetParmVal(
      DataClassType.DeviceInfo,
      new ArgVal([{ id: ArgValId.AreaId, value: 1 }]),
      [new ParmList([4, 65])]
    );
    expect(msg.toData()).toEqual([
      ...[0x03, 0x02], // message class, data class
      0x02, // NumDataBlock: (2)
      ...[0x05, 0x04], // data block #1: size (5), type (ArgVal)
      0x01, // NumArgValBlock: (1)
      0x01, // block #1: ArgID: (1)
      0x01, // block #1: ArgVal: (1)
      ...[0x05, 0x01], // data block #2: size (5), type (ParmList)
      0x02, // NumParmID: (2)
      0x04, // ParmID #1: (4)
      0x41, // ParmID #2: (65)
    ]);
  });
});
