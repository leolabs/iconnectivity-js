export enum Command {
  /** Used to change a device’s operating mode. */
  DeviceMode = 0x01,
  /** Used to manage globals and presets between RAM and non-volatile storage. */
  SaveLoad = 0x02,
  /** Used to set a group of parameters to a predefined state. */
  SetGroup = 0x03,
  /** Used to start a bulk data transfer operation. */
  BulkRequest = 0x04,
  /** Used to register for automatic parameter updates. */
  Notification = 0x05,
  /** Used to trigger MIDI operations, functions, and events. */
  MidiOperation = 0x06,
}
