import { CommandOptions, sendCommand } from "..";
import { HardwareInterfaceCommand, HardwareInterfaceType } from ".";

export interface HardwareValueParams extends CommandOptions {
  type: HardwareInterfaceType;
}

/** This command is used to get the current value from a hardware interface element. */
export const getHardwareValue = async ({
  output,
  input,
  productId,
  serialNumber,
  type,
}: HardwareValueParams) => {
  const response = await sendCommand({
    output,
    input,
    command: HardwareInterfaceCommand.GetHardwareValue,
    productId,
    serialNumber,
    data: [0x00, type],
  });

  if (!response) {
    return null;
  }

  return response;
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

/** Gets the state of the device's failover system */
export const getAutomaticFailoverState = async (
  data: CommandOptions
): Promise<AutomaticFailoverState | null> => {
  const response = await getHardwareValue({
    ...data,
    type: HardwareInterfaceType.AutomaticFailover,
  });

  if (!response) {
    return null;
  }

  return {
    alarm: !!(response[17] & 2),
    armed: !!(response[17] & 1),
    mainAudioState: response[18],
    mainMidiState: response[19],
    backupAudioState: response[20],
    backupMidiState: response[21],
  };
};
