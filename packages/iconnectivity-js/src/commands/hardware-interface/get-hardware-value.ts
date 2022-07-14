import { CommandOptions, sendCommand } from "..";
import { HardwareInterfaceCommand, HardwareInterfaceType } from ".";

export interface HardwareValueParams extends CommandOptions {
  type: HardwareInterfaceType;
}

/** This command is used to get the current value from a hardware interface element. */
export const getHardwareValue = async ({
  type,
  ...params
}: HardwareValueParams) => {
  return await sendCommand({
    ...params,
    command: HardwareInterfaceCommand.GetHardwareValue,
    data: [type, 0x00],
  });
};

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
    alarm: !!(response[22] & 2),
    armed: !!(response[22] & 1),
    mainAudioState: response[23],
    mainMidiState: response[24],
    backupAudioState: response[25],
    backupMidiState: response[26],
  };
};
