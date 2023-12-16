import { AudioAutomationInfo } from "./audio-automation-info";
import { AudioInfo } from "./audio-info";
import { AudioPortInfo } from "./audio-port-info";
import { BulkData } from "./bulk-data";
import { DeviceFeature } from "./device-feature";
import { DeviceInfo } from "./device-info";
import { HardwareInfo } from "./hardware-info";
import { MIDIFeature } from "./midi-feature";
import { MIDIInfo } from "./midi-info";
import { MIDIPortInfo } from "./midi-port-info";
import { SessionInfo } from "./session-info";

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

export type DataClassMap = {
  [DataClassType.SessionInfo]: SessionInfo;
  [DataClassType.DeviceInfo]: DeviceInfo;
  [DataClassType.DeviceFeature]: DeviceFeature;
  [DataClassType.HardwareInfo]: HardwareInfo;
  [DataClassType.MidiInfo]: MIDIInfo;
  [DataClassType.MidiPortInfo]: MIDIPortInfo;
  [DataClassType.MidiFeature]: MIDIFeature;
  [DataClassType.AudioInfo]: AudioInfo;
  [DataClassType.AudioPortInfo]: AudioPortInfo;
  [DataClassType.AudioAutomationInfo]: AudioAutomationInfo;
  [DataClassType.BulkData]: BulkData;
};

export * from "./audio-automation-info";
export * from "./audio-channel-info";
export * from "./audio-info";
export * from "./audio-port-info";
export * from "./bulk-data";
export * from "./device-feature";
export * from "./device-info";
export * from "./hardware-info";
export * from "./midi-feature";
export * from "./midi-info";
export * from "./midi-port-info";
export * from "./session-info";
