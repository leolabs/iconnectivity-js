/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AudioInfo } from "./audio-info";
import type { AudioPortInfo } from "./audio-port-info";

/**
 * This data class contains parameters related to automation controls for audio (ACA). Automation controls
 * are used to modify a device’s audio controls (e.g. fader, pan, mute) using standard MIDI continuous
 * controller messages. Typically, this is performed by connecting a suitable MIDI controller to a USB host
 * port or DIN port on a device and sending MIDI continuous controller messages to the device’s Automation
 * Control MIDI port. A MIDI controller can be used to modify multiple controls (of the same type) on a
 * device so that a single pushbutton or fader on the MIDI controller can mute or change the volume of
 * several audio channels on the device.
 *
 * Note that for mixer inputs it is necessary to set the AudioChannelNumberSRC parameter to a non-zero
 * value to indicate the mixer output channel. Although mixer inputs have a unique set of audio controls for
 * each mixer snapshot, automation always affects the currently active snapshot.
 *
 * Only analog and mixer audio ports support automation controls.
 */
export enum AudioAutomationInfo {
  /**
   * Audio stream (2 bytes):
   * - Byte 1: audio port ID (1 – N), use 0 to unassign this automation control
   * - Byte 2: destination (DST = 0) or source (SRC = 1) of audio port
   *
   * Only analog and mixer audio ports are supported.
   *
   * For mixer input streams (DST = 0) it is necessary to set the
   * {@link AudioChannelNumberSRC} parameter to a non-zero value to indicate the
   * mixer output channel.
   */
  AudioStream = 0x01,
  /**
   * Audio channel bitmap (BAx2 format). Each bit represents one audio channel,
   * bit 0 is channel 1, bit 1 is channel 2, etc. Least significant byte is first, most
   * significant byte is last. The most significant 4 bits of each byte must be 0
   * which allows 4 channels to be specified per byte. Unused bits should be set
   * to 0. The number of bytes (in the bitmap) is an even value so that the bitmap
   * (when unpacked) is a multiple of 8 bits: number of bytes (using INTEGER
   * math) = (((number of audio channels - 1) / 8 ) + 1) x 2.
   *
   * Example: device has 20 audio channels on the selected audio stream, select
   * channels 2, 3, 7, 11-14, 20:
   * ```
   * 0x06 // channels 3 and 2
   * 0x04 // channel 7
   * 0x0C // channels 12 and 11
   * 0x03 // channels 14 and 13
   * 0x08 // channel 20 is selected
   * 0x00 // channels 24 through 21 (padding)
   * ```
   * The maximum number of audio channels for all audio streams is given by
   * AudioInfo:AudioChannelMax.
   */
  AudioChannelBitmap = 0x02,
  /**
   * Source audio channel number (1 – N). Used to specify mixer output (SRC)
   * channel for automation controls assigned to mixer input (DST) channels.
   * Only used if AudioStream is mixer DST.
   */
  AudioChannelNumberSRC = 0x03,
  /**
   * Audio control ID from AudioChannelTypeDetail parameter block:
   * - 0x00: none
   * - 0x01: Mute
   * - 0x02: High Z
   * - 0x03: Phantom Power
   * - 0x04: Phase Inversion
   * - 0x05: Stereo Link
   * - 0x06: Solo Enable
   * - 0x07: Solo PFL
   * - 0x08: Dim Enable
   * - 0x0F: Pad
   * - 0x10: Volume
   * - 0x11: Solo Volume
   * - 0x12: Dim Level
   * - 0x13: Pan
   *
   * Only the controls that both exist and are editable for the selected audio port’s
   * channel type can be used with automation control.
   */
  AudioControlID = 0x04,
  /**
   * Minimum audio control value to be used for automation control. For volume
   * controls this is dB in 8.8 format (16-bit value encoded in 3 bytes, 16x3
   * format). Value must be within range of the values supported by the control,
   * not including 0x8000 (mute) value. Value should be less than
   * AudioControlMaxValue. Not applicable to switch type controls (mute, dim,
   * etc). Not used by pan controls; pan controls use negative of
   * AudioControlMaxValue for AudioControlMinValue.
   */
  AudioControlMinValue = 0x05,
  /**
   * Maximum audio control value to be used for automation control. For volume
   * controls this is dB in 8.8 format (16-bit value encoded in 3 bytes, 16x3
   * format). For pan controls this is an integer (16 bit 2’s complement value
   * encoded in 3 bytes, 16x3 format). Value must be within range of the values
   * supported by the control, not including 0x8000 (mute) value. Value should be
   * greater than AudioControlMinValue. Not applicable to switch type controls
   * (mute, dim, etc).
   */
  AudioControlMaxValue = 0x06,
  /**
   * ACA configuration flags (1 byte):
   * - bits 7-3: reserved (always 0).
   * - bit 2: set if lowest MIDI value should be used to mute volume control, only
   *   applicable to volume controls that support 0x8000 (mute) value.
   * - bit 1: set if MIDI values should be inverted so that 127 is lowest value and 0
   *   is highest value.
   * - bit 0: set if control is enabled, clear if control is disabled.
   */
  ACAFlags = 0x07,
  /**
   * Bitmask indicating which MIDI channels to use for automation control
   * (0x0001 = MIDI channel 1, 0x0002 = MIDI channel 2 … 0x8000 = MIDI
   * channel 16). More than 1 bit can be set (16-bit value encoded in 3 bytes,
   * 16x3 format).
   */
  MIDIChannels = 0x08,
  /**
   * MIDI continuous controller number to use for automation control (0 – 127) (1 byte).
   */
  MIDICCID = 0x09,
  /**
   * Minimum CC Value (0 – 127) (1 byte). The minimum CC value to be used for
   * automation control. Values less than this are treated as minimum value.
   * Value should be less than MIDIMaxCCValue. Only applicable to continuous
   * type controls (volume, pan, etc).
   */
  MIDIMinCCValue = 0x0a,
  /**
   * Maximum CC Value (0 – 127) (1 byte). The maximum CC value to be used
   * for automation control. Values greater than this are treated as maximum
   * value. Value should be greater than MIDIMinCCValue. Only applicable to
   * continuous type controls (volume, pan, etc).
   */
  MIDIMaxCCValue = 0x0b,
  /**
   * CC value to use for ON state (0 – 127) (1 byte). Values at this level and
   * above are treated as ON state. Values below this level are treated as OFF
   * state. Use the invert flag in ACAFlags parameter to reverse the logic. Only
   * applicable to switch type controls (mute, dim, etc).
   */
  MIDIOnCCValue = 0x0c,
}
