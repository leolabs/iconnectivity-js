export enum DeviceCommand {
  GetDevice = 0x01,
  RetDevice = 0x02,
  GetCommandList = 0x03,
  RetCommandList = 0x04,
  GetInfoList = 0x05,
  RetInfoList = 0x06,
  GetInfo = 0x07,
  RetSetInfo = 0x08,
  GetResetList = 0x09,
  RetResetList = 0x0a,
  GetSaveRestoreList = 0x0b,
  RetSaveRestoreList = 0x0c,
  GetEthernetPortInfo = 0x0d,
  RetSetEthernetPortInfo = 0x0e,
  ACK = 0x0f,
  Reset = 0x10,
  SaveRestore = 0x11,
  GetGizmoCount = 0x12,
  RetGizmoCount = 0x13,
  GetGizmoInfo = 0x14,
  RetGizmoInfo = 0x15,
  GetDeviceMode = 0x16,
  RetSetDeviceMode = 0x17,
  GetUserData = 0x18,
  RetSetUserData = 0x19,
}

export enum DeviceInfoType {
  AccessoryName = 0x01,
  ManufacturerName = 0x02,
  ModelNumber = 0x03,
  SerialNumber = 0x04,
  FirmwareVersion = 0x05,
  HardwareVersion = 0x06,
  DeviceName = 0x10,
}

export * from "./get-command-list";
export * from "./get-device";
export * from "./get-info-list";
export * from "./get-info";
