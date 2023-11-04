import { describe, expect, it } from "vitest";
import { GetCmdDef } from "./get-cmd-def";

describe("GetCmdDef Message", () => {
  it("should return the proper data", () => {
    const msg = new GetCmdDef();
    expect(msg.toData()).toEqual([
      ...[0x04, 0x00], // message class, data class
    ]);
  });
});
