import { DeviceCommand } from ".";
import { sendCommand } from "..";
import { mergeNumber } from "../../util/number";

export enum OperatingMode {
  Application = 0x01,
  BootLoader = 0x02,
  Test = 0x03,
}

/**
 * This contains basic information that a host will need to use to communicate
 * with this device (e.g. protocol version number). A host should cache this
 * information and use it for all further communication with this device.
 */
export interface RetDevice {
  productId: Uint8Array;
  serialNumber: Uint8Array;
  protocolVersion: number;
  operatingMode: OperatingMode;
  maxDataLength: number;
}

/**
 * This command is used to discover devices. The sender can specify a specific
 * product ID (PID), a specific serial number (SNUM), both PID & SNUM, or neither
 * (using wildcards). This command should always be the first command sent to a
 * device because the response contains useful information regarding maximum packet
 * size that can be used for other commands.
 */
export const getDevice = async (
  output: WebMidi.MIDIOutput,
  input: WebMidi.MIDIInput
): Promise<RetDevice | null> => {
  const response = await sendCommand({
    output,
    input,
    command: DeviceCommand.GetDevice,
  });

  if (!response) {
    return null;
  }

  return {
    productId: response.slice(0, 2),
    serialNumber: response.slice(2, 7),
    protocolVersion: response[14],
    operatingMode: response[15],
    maxDataLength: mergeNumber(response.slice(16, 18)),
  };
};
