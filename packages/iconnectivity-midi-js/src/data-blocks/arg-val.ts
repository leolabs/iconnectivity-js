import { DataBlock, DataBlockType } from ".";
import { Data } from "../util";

export enum MidiMonitorEvent {
  None = 0,
  NoteOff = 1,
  NoteOn = 2,
  PolyAftertouch = 3,
  ControlChange = 4,
  ProgramChange = 5,
  MonoAftertouch = 6,
  PitchBend = 7,
  Clock = 8,
  Start = 9,
  Continue = 10,
  Stop = 11,
  MidiTimecodeQuarterFrame = 12,
  SongPosition = 13,
  SongSelect = 14,
  TuneRequest = 15,
  ActiveSense = 16,
  Reset = 17,
  SystemExclusive = 18,
}

export enum ArgValId {
  /** Area selection (0 – N), optional. Only applies to devices that support areas. 0 is
   * used for the work area, 1 – N is used for the shadow areas. Work area is used if
   * this argument is not supplied.
   */
  AreaId = 0x01,
  /**
   * Scene selection (0 – N). Only applies to devices and parameters that support
   * scenes. 0 is used for the currently active scene, 1 – N is used to specify a
   * particular scene. Use 0 for globals and parameters that do not support scenes.
   */
  SceneId = 0x02,
  /** Hardware port type (1 – N). */
  HwPortType = 0x03,
  /** Hardware port ID (1 – N). */
  HwPortId = 0x04,
  /** MIDI port ID (1 – N). */
  MidiPortId = 0x05,
  /** MIDI channel number (1 – 16). */
  MidiChannel = 0x06,
  /**
   * MIDI AMP ID (1 – N). This specifies the AMP algorithm ID, the operatorID,
   * the custom route map ID, or the lookup table ID (depends on the parameter).
   */
  MidiAmpId = 0x07,
  /** USB host controller MIDI ID (1 – N). */
  UsbHMidiId = 0x08,
  /**
   * Preset ID (1 – N). Can be used to read some preset parameters directly from
   * non-volatile storage without having to load a preset into the working area
   * of the shadow area.
   */
  PresetId = 0x09,
  /** MIDI control change processor ID (1 – N). */
  MidiCcProcessorId = 0x0a,
  /** MIDI monitor event ID (0 – N). Supported values: {@link MidiMonitorEvent} */
  MidiMonitorEventId = 0x0b,
  /** MIDI-Gob ID (1 – N). */
  MidiGobId = 0x0c,
  /** Audio port ID (1 – N). */
  AudioPortId = 0x10,
  /** Destination audio channel number (1 – N). */
  AudioChannelNumberDst = 0x11,
  /** Source audio channel number (1 – N). */
  AudioChannelNumberSrc = 0x12,
  /** Audio channel type (1 – N). */
  AudioChannelType = 0x13,
  /** Audio mixer snapshot ID (1 – N). */
  AudioMixerSnapshotId = 0x14,
  /** Automation control for audio ID (1 – N). */
  ACAId = 0x15,
}

export interface ArgumentValue {
  id: ArgValId;
  value: number;
}

/**
 * This data block is used to define argument values when reading parameters from a device or writing
 * parameters to a device. If argument value blocks are used, they should always precede the ParmList and
 * ParmVal blocks to which they apply. Not all arguments are applicable to every data class; see the details
 * for each data class for a list of valid arguments.
 */
export class ArgVal extends DataBlock {
  type = DataBlockType.ArgVal;

  constructor(public values: ArgumentValue[]) {
    super();
  }

  static fromData(data: Data) {
    const length = data[2];
    const values: ArgumentValue[] = [];

    for (let i = 0; i < length; i++) {
      const id = data[3 + i * 2];
      const value = data[4 + i * 2];
      values.push({ id, value });
    }

    return new ArgVal(values);
  }

  getInternalData() {
    return [this.values.length, ...this.values.flatMap((v) => [v.id, v.value])];
  }
}
