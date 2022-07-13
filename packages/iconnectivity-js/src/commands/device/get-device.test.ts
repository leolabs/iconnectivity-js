import { Product } from "../../types/product";
import { testMidiCommand } from "../../util/mock-connection";
import { getDevice } from "./get-device";

describe("getDevice", () => {
  it("should correctly call the getDevice command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 01 00 00 3F F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 02 00 04 01 01 01 1F 12 F7";

    const info = await testMidiCommand(request, response, (device) =>
      getDevice({ device, transactionId: 0 })
    );

    expect(info?.productId).toBe(Product.PlayAUDIO12);
    expect(info?.protocolVersion).toBe(1);

    expect(info).toMatchInlineSnapshot(`
      Object {
        "maxDataLength": 3986,
        "operatingMode": 1,
        "productId": 11,
        "protocolVersion": 1,
        "serialNumber": Array [
          0,
          0,
          0,
          64,
          123,
        ],
      }
    `);
  });
});
