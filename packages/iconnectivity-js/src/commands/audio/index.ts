export enum AudioCommand {
  GetAudioGlobalParm = 0x40,
  RetSetAudioGlobalParm = 0x41,
  GetAudioPortParm = 0x42,
  RetSetAudioPortParm = 0x43,
  GetAudioDeviceParm = 0x44,
  RetSetAudioDeviceParm = 0x45,
  GetAudioControlParm = 0x46,
  RetSetAudioControlParm = 0x47,
  GetAudioControlDetail = 0x48,
  RetAudioControlDetail = 0x49,
  GetAudioControlDetailValue = 0x4a,
  RetSetAudioControlDetailValue = 0x4b,
  GetAudioClockParm = 0x4c,
  RetSetAudioClockParm = 0x4d,
  GetAudioPatchbayParm = 0x4e,
  RetSetAudioPatchbayParm = 0x4f,
  GetAudioChannelName = 0x3c,
  RetSetAudioChannelName = 0x3d,
  GetAudioPortMeterValue = 0x3e,
  RetAudioPortMeterValue = 0x3f,
}

export * from "./get-audio-global-parm";
export * from "./get-audio-port-meter-value";
