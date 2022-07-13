import uniqBy from "lodash/uniqBy";
import { sendCommand, SendCommandOptions } from "./commands";
import { getDevice, OperatingMode } from "./commands/device/get-device";
import { isTruthy } from "./util/array";
import { formatData } from "./util/data";
import { MAX_NUMBER } from "./util/number";

/** Requests MIDI access and scans all ports for iConnectivity devices */
export const getDevices = async () => {
  const access = await navigator.requestMIDIAccess({ sysex: true });

  const inputs = [...access.inputs.values()];
  const answers = await Promise.all(
    [...access.outputs.values()]
      .filter((o) => o.name?.includes("RSV"))
      .map(async (output) => {
        const input = inputs.find((input) => input.name === output.name);

        if (!input) {
          return null;
        }

        try {
          const deviceInfo = await getDevice({ output, input });

          if (deviceInfo) {
            return { input, output, deviceInfo };
          }
        } catch (e) {}

        return null;
      })
  );

  const devices = uniqBy(answers.filter(isTruthy), (d) =>
    d.deviceInfo.serialNumber.toString()
  );

  return devices;
};

export class Device {
  constructor(public output: MIDIOutput, public input: MIDIInput) {}

  private transactionId = 0;

  /**
   * Increases the transaction ID by 1 and returns it.
   * If the transaction ID is greater than MAX_NUMBER, it wraps around to 0.
   */
  private getNextTransactionId() {
    this.transactionId = (this.transactionId + 1) % MAX_NUMBER;
    return this.transactionId;
  }

  sendCommand(options: Omit<SendCommandOptions, "output" | "input">) {
    return sendCommand({
      ...options,
      output: this.output,
      input: this.input,
      transactionId: this.getNextTransactionId(),
    });
  }
}
