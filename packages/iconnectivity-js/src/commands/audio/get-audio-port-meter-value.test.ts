import { testMidiCommand } from "../../util/mock-connection";
import { getAudioPortMeterValue } from "./get-audio-port-meter-value";

describe("getAudioPortMeterValue", () => {
  it("should correctly call the command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 3E 00 03 00 01 03 7B F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 3F 00 28 01 00 01 02 01 0E 38 6B 38 6C 38 5D 38 3E 38 75 38 6A 24 31 26 2A 2C 23 2C 23 26 79 29 58 2F 7F 00 00 02 02 00 00 00 00 0A F7";

    const info = await testMidiCommand(request, response, (device) =>
      getAudioPortMeterValue({
        device,
        portId: 1,
        fetchInputs: true,
        fetchOutputs: true,
        transactionId: 0,
      })
    );

    expect(info).toMatchInlineSnapshot(`
      Object {
        "inputs": Array [
          Object {
            "channel": 1,
            "valueDb": -2.374285104791915,
            "valueRaw": 7275,
          },
          Object {
            "channel": 2,
            "valueDb": -2.3715361528255228,
            "valueRaw": 7276,
          },
          Object {
            "channel": 3,
            "valueDb": -2.4128101579808456,
            "valueRaw": 7261,
          },
          Object {
            "channel": 4,
            "valueDb": -2.4983806425295727,
            "valueRaw": 7230,
          },
          Object {
            "channel": 5,
            "valueDb": -2.3468125729996765,
            "valueRaw": 7285,
          },
          Object {
            "channel": 6,
            "valueDb": -2.3770344346470935,
            "valueRaw": 7274,
          },
          Object {
            "channel": 7,
            "valueDb": -11.295732085938237,
            "valueRaw": 4657,
          },
          Object {
            "channel": 8,
            "valueDb": -10.253982449217087,
            "valueRaw": 4906,
          },
          Object {
            "channel": 9,
            "valueDb": -7.3699638221933945,
            "valueRaw": 5667,
          },
          Object {
            "channel": 10,
            "valueDb": -7.3699638221933945,
            "valueRaw": 5667,
          },
          Object {
            "channel": 11,
            "valueDb": -9.934493297667007,
            "valueRaw": 4985,
          },
          Object {
            "channel": 12,
            "valueDb": -8.573635193676587,
            "valueRaw": 5336,
          },
          Object {
            "channel": 13,
            "valueDb": -5.756896922307232,
            "valueRaw": 6143,
          },
          Object {
            "channel": 14,
            "valueDb": -Infinity,
            "valueRaw": 0,
          },
        ],
        "outputs": Array [
          Object {
            "channel": 1,
            "valueDb": -Infinity,
            "valueRaw": 0,
          },
          Object {
            "channel": 2,
            "valueDb": -Infinity,
            "valueRaw": 0,
          },
        ],
        "portId": 1,
      }
    `);
  });
});
