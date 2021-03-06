import {
  CommandOptions,
  getHardwareValue,
  HardwareInterfaceType,
  setHardwareValue,
} from "..";
import { makeBitmap } from "../../util/bitmap";

export enum AudioMidiState {
  /** Host is not connected or is not sending any USB data. */
  NotConnected = 0x00,
  /** Host has enumerated the device and is sending USB start of frame (SOF). */
  Connected = 0x01,
  /** Host is sending data to the USB audio or MIDI OUT endpoint. */
  SendingData = 0x02,
  /** Host is sending non-zero data to the specified audio channel (main audio only) or sending data to the specified MIDI port (main MIDI only). */
  SendingNonZeroData = 0x03,
}

export interface AutomaticFailoverState {
  alarm: boolean;
  armed: boolean;
  mainAudioState: AudioMidiState;
  mainMidiState: AudioMidiState;
  backupAudioState: AudioMidiState;
  backupMidiState: AudioMidiState;
}

/** Gets the state of the device's failover system. */
export const getAutomaticFailoverState = async (
  params: CommandOptions
): Promise<AutomaticFailoverState> => {
  const response = await getHardwareValue({
    ...params,
    type: HardwareInterfaceType.AutomaticFailover,
  });

  return {
    alarm: !!(response[4] & 2),
    armed: !!(response[4] & 1),
    mainAudioState: response[5],
    mainMidiState: response[6],
    backupAudioState: response[7],
    backupMidiState: response[8],
  };
};

export interface SetAutomaticFailoverStateParams extends CommandOptions {
  alarm?: boolean;
  armed?: boolean;
}

/** Sets the state of the device's failover system. */
export const setAutomaticFailoverState = async ({
  alarm,
  armed,
  ...params
}: SetAutomaticFailoverStateParams) => {
  const valueFlags = makeBitmap(alarm !== undefined, armed !== undefined);
  const values = makeBitmap(alarm, armed);
  const data = [0x00, valueFlags, values];

  await setHardwareValue({
    ...params,
    type: HardwareInterfaceType.AutomaticFailover,
    data,
  });
};
