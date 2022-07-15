import { HardwareInterfaceType } from ".";
import { testMidiCommand } from "../../util/mock-connection";
import { setHardwareValue } from "./set-hardware-value";

describe("setHardwareValue", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 41 05 00 05 01 03 00 02 00 2F F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 0F 00 03 41 05 00 62 F7";

    await testMidiCommand(request, response, (device) =>
      setHardwareValue({
        device,
        type: HardwareInterfaceType.AutomaticFailover,
        data: [0x00, 0x02, 0x00],
        transactionId: 0,
      })
    );
  });
});
