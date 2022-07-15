import { CommandOptions, getResponseBody, sendCommand } from "..";
import { HardwareInterfaceCommand, HardwareInterfaceType } from ".";

export interface HardwareValueParams extends CommandOptions {
  type: HardwareInterfaceType;
}

/** This command is used to get the current value from a hardware interface element. */
export const getHardwareValue = async ({
  type,
  ...params
}: HardwareValueParams) => {
  const response = await sendCommand({
    ...params,
    command: HardwareInterfaceCommand.GetHardwareValue,
    data: [type, 0x00],
  });

  return getResponseBody(response);
};
