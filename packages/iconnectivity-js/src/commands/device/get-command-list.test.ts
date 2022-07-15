import { testMidiCommand } from "../../util/mock-connection";
import { getCommandList } from "./get-command-list";

describe("getCommandList", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 03 00 00 3D F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 04 00 5A 00 05 00 07 00 09 00 0B 00 0D 00 10 00 11 00 12 00 14 00 18 00 20 00 22 00 24 00 26 00 28 00 2A 00 2C 00 2E 00 70 00 3C 00 3E 00 40 00 42 00 44 00 46 00 48 00 4A 00 4C 00 4E 00 50 00 52 00 54 00 56 00 58 00 5A 00 5C 00 5E 00 60 00 7E 00 66 00 68 00 6A 01 00 01 02 01 04 1F F7";

    const supportedCommands = await testMidiCommand(
      request,
      response,
      (device) => getCommandList({ device, transactionId: 0 })
    );

    expect(supportedCommands).toMatchInlineSnapshot(`
      Array [
        5,
        7,
        9,
        11,
        13,
        16,
        17,
        18,
        20,
        24,
        32,
        34,
        36,
        38,
        40,
        42,
        44,
        46,
        112,
        60,
        62,
        64,
        66,
        68,
        70,
        72,
        74,
        76,
        78,
        80,
        82,
        84,
        86,
        88,
        90,
        92,
        94,
        96,
        126,
        102,
        104,
        106,
        128,
        130,
        132,
      ]
    `);
  });
});
