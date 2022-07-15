import { testMidiCommand } from "../../util/mock-connection";
import { getAutomaticFailoverState, setAutomaticFailoverState } from "./extras";

describe("getAutomaticFailoverState", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 41 04 00 02 03 00 36 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 01 05 00 09 01 03 00 03 01 03 02 00 00 1E F7";

    const info = await testMidiCommand(request, response, (device) =>
      getAutomaticFailoverState({ device, transactionId: 0 })
    );

    expect(info).toMatchInlineSnapshot(`
      Object {
        "alarm": false,
        "armed": true,
        "backupAudioState": 0,
        "backupMidiState": 0,
        "mainAudioState": 3,
        "mainMidiState": 2,
      }
    `);
  });
});

describe("setAutomaticFailoverState", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 41 05 00 05 01 03 00 02 00 2F F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 0F 00 03 41 05 00 62 F7";

    await testMidiCommand(request, response, (device) =>
      setAutomaticFailoverState({ device, alarm: false, transactionId: 0 })
    );
  });
});
