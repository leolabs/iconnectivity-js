import { Product } from "../../types/product";
import { testMidiCommand } from "../../util/mock-connection";
import { applySnapshot } from "./apply-snapshot";
import { SnapshotType } from "./get-snapshot-list";

describe("applySnapshot", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 6D 00 03 01 7F 01 4F F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 02 00 04 01 01 01 1F 12 F7";

    await testMidiCommand(request, response, (device) =>
      applySnapshot({
        device,
        snapshotType: SnapshotType.Scene,
        snapshotId: 1,
        transactionId: 0,
      })
    );
  });
});
