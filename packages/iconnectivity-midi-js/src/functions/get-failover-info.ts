import { ParmList } from "../data-blocks/parm-list";
import { DataClassType, DeviceFeature } from "../data-classes";
import { getParmVal } from "../messages/get-parm-val";
import { MessageOptions } from "../send-message";

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
  armed: boolean;
  alarm: boolean;
  scene: number;
  mainAudioState: AudioMidiState;
  mainMidiState: AudioMidiState;
  backupAudioState: AudioMidiState;
  backupMidiState: AudioMidiState;
}

export const getFailoverInfo = async (
  params: MessageOptions
): Promise<AutomaticFailoverState> => {
  const res = await getParmVal({
    ...params,
    dataType: DataClassType.DeviceFeature,
    parmList: new ParmList([
      DeviceFeature.SceneNumber,
      DeviceFeature.FailoverArmStatus,
      DeviceFeature.FailoverAlarmStatus,
      DeviceFeature.FailoverUSBPortStatus,
    ]),
  });

  const scene = res.parmVals[0].values[0].data[0];
  const armStatus = res.parmVals[0].values[1].data[0];
  const alarmStatus = res.parmVals[0].values[2].data[0];
  const portStatus = res.parmVals[0].values[3].data;

  return {
    alarm: Boolean(alarmStatus),
    armed: Boolean(armStatus),
    scene,
    mainAudioState: portStatus[0],
    mainMidiState: portStatus[1],
    backupAudioState: portStatus[2],
    backupMidiState: portStatus[3],
  };
};
