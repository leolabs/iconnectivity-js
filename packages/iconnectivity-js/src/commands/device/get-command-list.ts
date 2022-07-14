import { DeviceCommand } from ".";
import { Command, CommandOptions, sendCommand } from "..";
import { mergeNumber } from "../../util/number";

/**
 * This command is used to query a device about which command IDs it supports.
 * Note that command IDs 0x01 and 0x03 are never returned (it is assumed that
 * all devices support these command IDs).
 */
export const getCommandList = async (
  params: CommandOptions
): Promise<Command[] | null> => {
  const response = await sendCommand({
    ...params,
    command: DeviceCommand.GetCommandList,
  });

  const length = mergeNumber(response.slice(16, 18));

  if (length % 2 !== 0) {
    throw new Error(`Length should be even, but was ${length}`);
  }

  const commands: Command[] = [];

  for (let i = 0; i < length; i += 2) {
    const start = 18 + i;
    const end = start + 2;
    commands.push(mergeNumber(response.slice(start, end)));
  }

  return commands;
};
