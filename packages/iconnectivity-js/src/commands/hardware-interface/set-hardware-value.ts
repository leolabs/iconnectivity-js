import { CommandOptions, sendCommand } from "..";
import { HardwareInterfaceCommand, HardwareInterfaceType } from ".";
import { Data } from "../../util/data";

export interface SetHardwareValueParams extends CommandOptions {
  type: HardwareInterfaceType;
  data: Data;
}

/** This command is used to get the current value from a hardware interface element. */
export const setHardwareValue = async ({
  type,
  data,
  ...params
}: SetHardwareValueParams) => {
  return await sendCommand({
    ...params,
    command: HardwareInterfaceCommand.RetSetHardwareValue,
    data: [0x01, type, ...data],
  });
};
