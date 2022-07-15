import { HardwareInterfaceType } from ".";
import { testMidiCommand } from "../../util/mock-connection";
import { getHardwareValue } from "./get-hardware-value";

describe("getHardwareValue", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 41 04 00 02 03 00 36 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 01 05 00 09 01 03 00 03 01 03 02 00 00 1E F7";

    const info = await testMidiCommand(request, response, (device) =>
      getHardwareValue({
        device,
        type: HardwareInterfaceType.AutomaticFailover,
        transactionId: 0,
      })
    );

    expect(info).toMatchInlineSnapshot(`
      Array [
        1,
        3,
        0,
        3,
        1,
        3,
        2,
        0,
        0,
      ]
    `);
  });
});
