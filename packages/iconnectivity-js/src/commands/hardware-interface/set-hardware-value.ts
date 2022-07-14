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

export interface SetAutomaticFailoverStateParams extends CommandOptions {
  alarm?: boolean;
  arm?: boolean;
}

/** Sets the state of the device's failover system. */
export const setAutomaticFailoverState = async ({
  alarm,
  arm,
  ...params
}: SetAutomaticFailoverStateParams) => {
  const valueFlags =
    (alarm !== undefined ? 2 : 0) + (arm !== undefined ? 1 : 0);
  const values = (alarm ? 2 : 0) + (arm ? 1 : 0);
  const data = [0x00, valueFlags, values];

  await setHardwareValue({
    ...params,
    type: HardwareInterfaceType.AutomaticFailover,
    data,
  });
};
