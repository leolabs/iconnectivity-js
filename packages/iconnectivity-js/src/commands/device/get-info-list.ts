import { DeviceCommand, DeviceInfoType } from ".";
import { CommandOptions, sendCommand } from "..";
import { mergeNumber } from "../../util/number";

/**
 * This command is used to query a device about which info IDs it supports.
 */
export const getInfoList = async (
  params: CommandOptions
): Promise<DeviceInfoType[]> => {
  const response = await sendCommand({
    ...params,
    command: DeviceCommand.GetInfoList,
  });

  const length = mergeNumber(response.slice(16, 18));

  if (length % 2 !== 0) {
    throw new Error(`Length should be even, but was ${length}`);
  }

  const infos: DeviceInfoType[] = [];

  for (let i = 0; i < length; i += 2) {
    const start = 18 + i;
    infos.push(response[start]);
  }

  return infos;
};
