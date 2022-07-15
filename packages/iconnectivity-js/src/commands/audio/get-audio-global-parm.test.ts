import { testMidiCommand } from "../../util/mock-connection";
import { getAudioGlobalParm } from "./get-audio-global-parm";

describe("getAudioGlobalParm", () => {
  it("should correctly call the getAudioGlobalParm command and parse the result", async () => {
    const request =
      "F0 00 01 73 7E 00 00 00 00 00 00 00 00 00 40 40 00 00 00 F7";
    const response =
      "F0 00 01 73 7E 00 0B 00 00 00 40 7B 00 00 00 41 00 23 01 00 03 02 05 03 01 04 02 05 08 01 04 05 02 04 06 03 04 07 04 04 08 05 06 05 06 06 06 07 06 07 08 06 08 34 F7";

    const info = await testMidiCommand(request, response, (device) =>
      getAudioGlobalParm({ device, transactionId: 0 })
    );

    expect(info.audioPortCount).toBe(3);

    expect(info).toMatchInlineSnapshot(`
      Object {
        "activeConfiguration": 5,
        "audioPortCount": 3,
        "configurations": Array [
          Object {
            "bitDepth": 16,
            "configNumber": 1,
            "sampleRate": 44100,
          },
          Object {
            "bitDepth": 16,
            "configNumber": 2,
            "sampleRate": 48000,
          },
          Object {
            "bitDepth": 16,
            "configNumber": 3,
            "sampleRate": 88200,
          },
          Object {
            "bitDepth": 16,
            "configNumber": 4,
            "sampleRate": 96000,
          },
          Object {
            "bitDepth": 24,
            "configNumber": 5,
            "sampleRate": 44100,
          },
          Object {
            "bitDepth": 24,
            "configNumber": 6,
            "sampleRate": 48000,
          },
          Object {
            "bitDepth": 24,
            "configNumber": 7,
            "sampleRate": 88200,
          },
          Object {
            "bitDepth": 24,
            "configNumber": 8,
            "sampleRate": 96000,
          },
        ],
        "currentBufferedAudioFrames": 3,
        "currentSyncFactor": 2,
        "maxBufferedAudioFrames": 5,
        "maxSyncFactor": 4,
        "minBufferedAudioFrames": 2,
        "minSyncFactor": 1,
      }
    `);
  });
});
