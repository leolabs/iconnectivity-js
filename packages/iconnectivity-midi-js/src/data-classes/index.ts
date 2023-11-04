export enum DataClassType {
  /** Placeholder value for messages that don’t require a data class. */
  Null = 0x00,
  /** Used to discover devices and to establish communications parameters. */
  SessionInfo = 0x01,
  /** Contains many read-only global parameters for a device. */
  DeviceInfo = 0x02,
  /** Contains parameters related to global device features. */
  DeviceFeature = 0x03,
  /** Contains parameters related to hardware ports. */
  HardwareInfo = 0x04,
  /** Contains global parameters related to the MIDI configuration of a device. */
  MidiInfo = 0x05,
  /** Contains parameters related to specific MIDI ports. */
  MidiPortInfo = 0x06,
  /** Contains parameters for advanced MIDI features. */
  MidiFeature = 0x07,
  /** Contains global parameters related to the audio configuration of a device. */
  AudioInfo = 0x08,
  /** Contains parameters related to specific audio ports. */
  AudioPortInfo = 0x09,
  /** Contains parameters related to specific audio channels. */
  AudioChannelInfo = 0x0a,
  /** Contains parameters related to automation controls for audio. */
  AudioAutomationInfo = 0x0b,
  /** Used to perform bulk data transfer operations. */
  BulkData = 0x70,
}
