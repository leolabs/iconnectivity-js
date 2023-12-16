/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ArgValId } from "../data-blocks/arg-val";
import type { AudioInfo } from "./audio-info";

/**
 * This data class contains parameters related to specific audio ports.
 * Audio port ID is a required argument for all parameters in this data class.
 */
export enum AudioPortInfo {
  /** Audio port type (1 byte), see {@link AudioPortType}. */
  PortType = 0x01,
  /**
   * Audio port identifier (1 byte) (1 – N). Used to differentiate between multiple
   * instances of the same type of audio port on a product. For most audio port
   * types there will only ever be one instance of that type (i.e. analog, mixer and
   * tone generator). For other types of ports:
   *
   * USB Device: USB device port ID (1 – N).
   */
  PortIdentifier = 0x02,
  /**
   * Audio port flags (1 byte).
   * - bits 7 - 2: always 0
   * - bit 1: set if getting SRC meter values requires that the DST channel
   *   number be specified using {@link ArgValId.AudioChannelNumberDst} ArgID
   * - bit 0: set if getting DST meter values requires that the SRC channel
   *   number be specified using {@link ArgValId.AudioChannelNumberSrc} ArgID
   *
   * Most ports do not require SRC or DST channel number to be specified
   * when getting meter values. Mixers are different.
   */
  PortFlags = 0x03,
  /**
   * The channel count supported for each audio configuration. Each channel
   * count structure consists of 9 values (10 bytes):
   * - Byte 1: configuration number (1 – {@link AudioInfo.AudioConfigCount})
   * - Byte 2: maximum value for sum of SRC and DST channels
   * - Bytes 3-4: maximum value for product of SRC and DST channels (14x2 format)
   * - Byte 5: minimum number of DST channels allowed
   * - Byte 6: maximum number of DST channels allowed
   * - Byte 7: minimum number of SRC channels allowed
   * - Byte 8: maximum number of SRC channels allowed
   * - Byte 9: default number of DST channels
   * - Byte 10: default number of SRC channels
   *
   * The number of structures is given by {@link AudioInfo.AudioConfigCount}. For
   * example, a product that supports four sample rates will return four channel
   * count structures:
   *
   * ```
   * 1, 20, 100, 2, 18, 2, 18, 10, 10 // channel count for configuration #1 (44.1 kHz)
   * 2, 20, 100, 2, 18, 2, 18, 10, 10 // channel count for configuration #2 (48 kHz)
   * 3, 12, 50, 2, 10, 2, 10, 6, 6 // channel count for configuration #3 (88.2 kHz)
   * 4, 12, 50, 2, 10, 2, 10, 6, 6 // channel count for configuration #4 (96 kHz)
   * ```
   */
  PortChannelCountSupport = 0x04,
  /**
   * Audio meter values for the DST channels for this port. Each meter value is 2
   * bytes, 14x2 format. 0 dB is 8192 (0x2000) and is the maximum value that
   * can be returned (representing digital full scale). The first value is channel 1,
   * the second value is channel 2, etc. To convert to decibels (dB) use the
   * formula:
   * ```
   * dB = 20 log (value / 8192)
   * ```
   *
   * The minimum meter value of 0x0001 corresponds to -78.27 dB but
   * resolution drops to 1 dB when meter value is 0x0008 (-60 dB).
   */
  PortMeterDST = 0x08,
  /**
   * Audio meter values for the SRC channels for this port. Each meter value is
   * 2 bytes, 14x2 format. 0 dB is 8192 (0x2000) and is the maximum value that
   * can be returned (representing digital full scale). The first value is channel 1,
   * the second value is channel 2, etc. To convert to decibels (dB) use the
   * formula:
   * ```
   * dB = 20 log (value / 8192)
   * ```
   *
   * The minimum meter value of 0x0001 corresponds to -78.27 dB but
   * resolution drops to 1 dB when meter value is 0x0008 (-60 dB).
   */
  PortMeterSRC = 0x09,
  /**
   * Audio channel type, one byte for each DST channel for this port. The audio
   * channel type defines which Audio Controls are available for each DST
   * channel. See {@link AudioInfo.AudioChannelTypeDetail}. Use the
   * `AudioChannelInfo:ChannelTypeDST` parameter to get the channel type for a
   * single DST channel.
   */
  PortChannelTypeDST = 0x0a,
  /**
   * Audio channel type, one byte for each SRC channel for this port. The audio
   * channel type defines which Audio Controls are available for each SRC
   * channel. See {@link AudioInfo.AudioChannelTypeDetail}. Use the
   * `AudioChannelInfo:ChannelTypeSRC` parameter to get the channel type for
   * a single SRC channel.
   */
  PortChannelTypeSRC = 0x0b,
  /**
   * The channel counts that are currently active for this audio port (2 bytes):
   * - Byte 1: DST channel count
   * - Byte 2: SRC channel count
   *
   * Read-only and may not be the same as
   * {@link PortChannelCountRestartValue}. Only supports Area 0 (work area).
   */
  PortChannelCountCurrentValue = 0x10,
  /**
   * The selected channel counts for this audio port (2 bytes):
   * - Byte 1: DST channel count
   * - Byte 2: SRC channel count
   *
   * Changing the channel counts requires rebooting the device before the new
   * values become active. Read-write and may not be same as
   * {@link PortChannelCountCurrentValue}.
   */
  PortChannelCountRestartValue = 0x40,
  /**
   * Audio port name (7-bit ASCII string).
   * Maximum length is given by {@link AudioInfo.AudioPortNameMax}.
   */
  PortName = 0x41,
  /**
   * Audio patchbay connections for all DST audio channels for this port (2 bytes
   * for each DST audio channel). For example, an audio port with two DST
   * channels would contain four bytes:
   * - Byte 1: SRC audio port ID (1 – N) for DST channel 1
   * - Byte 2: SRC audio channel number (1 – N) for DST channel 1
   * - Byte 3: SRC audio port ID (1 – N) for DST channel 2
   * - Byte 4: SRC audio channel number (1 – N) for DST channel 2
   *
   * A DST audio channel can be connected to (at most) one SRC audio
   * channel. Use 0x00 for both the port ID and channel number bytes to
   * disconnect a DST audio channel from all SRC audio channels. Use the
   * `AudioChannelInfo:ChannelPatchbay` parameter to read/write a single
   * patchbay DST channel. `AudioMixerSnapshotID` is a required ArgID for mixer
   * ports.
   */
  PortPatchbay = 0x42,
  /**
   * Currently active mixer snapshot (1 – N) (1 byte). This parameter can be used
   * to change the active mixer snapshot in the currently loaded preset. Maximum
   * value is given by {@link AudioInfo.AudioMixerSnapshotMax}.
   */
  MixerSnapshotNumber = 0x50,
  /**
   * Mixer snapshot name (7-bit ASCII string). Maximum length is given by
   * {@link AudioInfo.AudioPortNameMax}. `AudioMixerSnapshotID` is a required ArgID
   * for this parameter.
   */
  MixerSnapshotName = 0x51,
}

export enum AudioPortType {
  USBDevice = 0x01,
  Analog = 0x02,
  Mixer = 0x03,
  ToneGenerator = 0x04,
}
