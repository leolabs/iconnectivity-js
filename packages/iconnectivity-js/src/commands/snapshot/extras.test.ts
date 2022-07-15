import { testMidiCommand } from "../../util/mock-connection";
import { getActiveScene, setActiveScene } from "./extras";

describe("getActiveScene", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 6A 00 01 7F 56 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 6B 00 08 01 7F 00 01 00 02 01 02 41 F7";

    const scene = await testMidiCommand(request, response, (device) =>
      getActiveScene({
        device,
        transactionId: 0,
      })
    );

    expect(scene).toBe(1);
  });
});

describe("setActiveScene", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 6D 00 03 01 7F 02 4E F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 0F 00 03 40 6D 00 7B F7";

    await testMidiCommand(request, response, (device) =>
      setActiveScene({
        device,
        scene: 2,
        transactionId: 0,
      })
    );
  });
});
