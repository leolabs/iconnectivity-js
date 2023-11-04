import { describe, expect, it } from "vitest";
import { DataClassType } from "../data-classes";
import { GetParmDef } from "./get-parm-def";

describe("GetParmDef Message", () => {
  it("should return the proper data", () => {
    const msg = new GetParmDef(DataClassType.DeviceInfo);
    expect(msg.toData()).toEqual([
      ...[0x02, 0x02], // message class, data class
    ]);
  });
});
