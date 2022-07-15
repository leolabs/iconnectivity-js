import { testMidiCommand } from "../../util/mock-connection";
import { getInfoList } from "./get-info-list";

describe("getInfoList", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 05 00 00 3B F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 06 00 0E 01 00 02 00 03 00 04 00 05 00 06 00 10 1F 62 F7";

    const info = await testMidiCommand(request, response, (device) =>
      getInfoList({ device, transactionId: 0 })
    );

    expect(info).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        16,
      ]
    `);
  });
});
