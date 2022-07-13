import { DeviceCommand, DeviceInfoType } from ".";
import { CommandOptions, sendCommand } from "..";
import { mergeNumber } from "../../util/number";

interface GetInfoParams extends CommandOptions {
  infoType: DeviceInfoType;
}

/**
 * This command is used to query a device about which info IDs it supports.
 */
export const getInfo = async ({
  infoType,
  ...params
}: GetInfoParams): Promise<string | null> => {
  const response = await sendCommand({
    ...params,
    command: DeviceCommand.GetInfo,
    data: [infoType],
  });

  if (!response) {
    return null;
  }

  const length = mergeNumber(response.slice(16, 18));
  const result = response.slice(19, 19 + length - 1);

  return [...result].map((c) => String.fromCharCode(c)).join("");
};
