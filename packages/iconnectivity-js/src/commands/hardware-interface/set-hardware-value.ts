import { CommandOptions, sendCommand } from "..";
import { HardwareInterfaceCommand, HardwareInterfaceType } from ".";
import { Data } from "../../util/data";
import { makeBitmap } from "../../util/bitmap";

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
  const valueFlags = makeBitmap(alarm !== undefined, arm !== undefined);
  const values = makeBitmap(alarm, arm);
  const data = [0x00, valueFlags, values];

  await setHardwareValue({
    ...params,
    type: HardwareInterfaceType.AutomaticFailover,
    data,
  });
};
