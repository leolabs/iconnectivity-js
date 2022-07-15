export enum HardwareInterfaceCommand {
  GetHardwareGlobalParm = 0x80,
  RetHardwareGlobalParm = 0x81,
  GetHardwareParm = 0x82,
  RetSetHardwareParm = 0x83,
  GetHardwareValue = 0x84,
  RetSetHardwareValue = 0x85,
}

export enum HardwareInterfaceType {
  Footswitch = 0x01,
  MuteGroup = 0x02,
  AutomaticFailover = 0x03,
  ToneGenerator = 0x04,
}
