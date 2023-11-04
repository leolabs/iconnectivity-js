import { describe, expect, it } from "vitest";
import { HstSesnVal } from "./hst-sesn-val";
import { ParmVal } from "../data-blocks/parm-val";
import { splitNumber } from "../util";

describe("HstSesnVal Message", () => {
  it("should return the proper data", () => {
    const msg = new HstSesnVal([
      new ParmVal([{ id: 1, data: splitNumber(256) }]),
    ]);
    expect(msg.toData()).toEqual([
      ...[0x01, 0x01], // message class, data class
      0x01, // NumDataBlock: (1)
      ...[0x07, 0x03], // data block #1: size (7), type (ParmVal)
      0x01, // NumParmValBlock: (1)
      0x04, // block #1: ParmSize: (4)
      0x01, // block #1: ParmID: (1)
      ...[0x02, 0x00], // block #1: ParmVal: (256)
    ]);
  });
});
