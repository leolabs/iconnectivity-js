import { DeviceInfoType } from ".";
import { testMidiCommand } from "../../util/mock-connection";
import { getInfo } from "./get-info";

describe("getInfo", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 07 00 01 10 28 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 08 00 11 10 50 6C 61 79 41 55 44 49 4F 31 32 20 54 65 73 74 66 F7";

    const info = await testMidiCommand(request, response, (device) =>
      getInfo({ device, infoType: DeviceInfoType.DeviceName, transactionId: 0 })
    );

    expect(info).toBe("PlayAUDIO12 Test");
  });
});
