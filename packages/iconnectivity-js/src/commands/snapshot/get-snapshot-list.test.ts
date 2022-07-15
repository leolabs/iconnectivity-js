import { testMidiCommand } from "../../util/mock-connection";
import { applySnapshot } from "./apply-snapshot";
import { getSnapshotList, SnapshotType } from "./get-snapshot-list";

describe("getSnapshotList", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 6A 00 01 7F 56 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 6B 00 08 01 7F 00 01 00 02 01 02 41 F7";

    const result = await testMidiCommand(request, response, (device) =>
      getSnapshotList({
        device,
        snapshotType: SnapshotType.Scene,
        transactionId: 0,
      })
    );

    expect(result).toMatchInlineSnapshot(`
      Object {
        "commandVersion": 1,
        "lastSnapshotId": 1,
        "lastSnapshotListIndex": 0,
        "loopEnabled": false,
        "snapshotList": Array [
          1,
          2,
        ],
        "snapshotType": 127,
      }
    `);
  });
});
