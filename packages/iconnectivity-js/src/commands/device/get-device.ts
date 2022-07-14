import { DeviceCommand } from ".";
import { CommandOptions, sendCommand } from "..";
import { Product } from "../../types/product";
import { Data } from "../../util/data";
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
export interface DeviceInfo {
  productId: Product;
  serialNumber: Data;
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
  params: CommandOptions
): Promise<DeviceInfo> => {
  const response = await sendCommand({
    ...params,
    command: DeviceCommand.GetDevice,
  });

  return {
    productId: response[6],
    serialNumber: response.slice(7, 12),
    protocolVersion: response[19],
    operatingMode: response[20],
    maxDataLength: mergeNumber(response.slice(21, 23)),
  };
};
