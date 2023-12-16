/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ArgValId } from "../data-blocks/arg-val";
import type { AudioInfo } from "./audio-info";
import type { AudioPortInfo } from "./audio-port-info";

/**
 * This data class contains parameters related to specific audio channels. Audio port ID and audio channel
 * number DST/SRC are required arguments for all parameters in this data class. Most parameters apply to
 * to both DST and SRC audio channels but some parameters only apply to DST channels and some
 * parameters only apply to SRC channels.
 */
export enum AudioChannelInfo {
  /**
   * Audio channel type (1 byte). The audio channel type defines which Audio
   * Controls are available for this DST channel.
   * See {@link AudioInfo.AudioChannelTypeDetail}.
   * Use the {@link AudioPortInfo.PortChannelTypeDST} parameter to get the channel
   * type for all channels of a port.
   */
  ChannelTypeDST = 0x01,
  /**
   * Audio channel type (1 byte). The audio channel type defines which Audio
   * Controls are available for this SRC channel. See
   * {@link AudioInfo.AudioChannelTypeDetail}. Use the
   * {@link AudioPortInfo.PortChannelTypeSRC} parameter to get the channel types for
   * all channels of a port.
   */
  ChannelTypeSRC = 0x02,
  /**
   * Audio channel name for DST channel (7-bit ASCII string).
   * Maximum length is given by {@link AudioInfo.AudioChannelNameMax}.
   */
  ChannelNameDST = 0x03,
  /**
   * Audio channel name for SRC channel (7-bit ASCII string).
   * Maximum length is given by {@link AudioInfo.AudioChannelNameMax}.
   */
  ChannelNameSRC = 0x04,
  /**
   * Parameter block containing audio control values for this DST channel. Most
   * channel types require that {@link ArgValId.AudioChannelNumberDst} be specified but some
   * require that both {@link ArgValId.AudioChannelNumberDst} and {@link ArgValId.AudioChannelNumberSrc}
   * be specified. This parameter supports the ChannelBitmapDST parameter with SetParmVal
   * messages to set the control values for multiple channels to the same value
   * using one message.
   */
  ChannelControlValueDST = 0x05,
  /**
   * Parameter block containing audio control values for this SRC channel. Most
   * channel types require that {@link ArgValId.AudioChannelNumberSrc} be specified but some
   * require that both {@link ArgValId.AudioChannelNumberDst} and {@link ArgValId.AudioChannelNumberSrc}
   * be specified. This parameter supports the ChannelBitmapSRC parameter with SetParmVal
   * messages to set the control values for multiple channels to the same value
   * using one message.
   */
  ChannelControlValueSRC = 0x06,
  /**
   * Audio patchbay connection for DST audio channel (2 bytes):
   * - Byte 1: SRC audio port ID (1 – N)
   * - Byte 2: SRC audio channel number (1 – N)
   *
   * A DST audio channel can be connected to (at most) one SRC audio channel.
   * Use 0x00 for both bytes to disconnect a DST audio channel from all SRC
   * audio channels. Use the {@link AudioPortInfo.PortPatchbay} parameter to read/write
   * all patchbay connections for a port. {@link ArgValId.AudioMixerSnapshotID} is a required
   * ArgID for mixer channels.
   */
  ChannelPatchbay = 0x07,
  /**
   * Audio channel bitmap (BAx2 format). Each bit represents one audio channel,
   * bit 0 is channel 1, bit 1 is channel 2, etc. Least significant byte is first, most
   * significant byte is last. The most significant 4 bits of each byte must be 0
   * which allows 4 channels to be specified per byte. Unused bits should be set
   * to 0. The number of bytes (in the bitmap) is an even value so that the bitmap
   * (when unpacked) is a multiple of 8 bits: number of bytes (using INTEGER
   * math) = (((number of audio channels - 1) / 8 ) + 1) x 2.
   *
   * Example: device has 20 audio channels on the selected DST audio stream,
   * select channels 2, 3, 7, 11-14, 20:
   * ```
   * 0x06 // channels 3 and 2
   * 0x04 // channel 7
   * 0x0C // channels 12 and 11
   * 0x03 // channels 14 and 13
   * 0x08 // channel 20 is selected
   * 0x00 // channels 24 through 21 (padding)
   * ```
   * This parameter is used with the ChannelControlValueDST parameter to set
   * the control values for multiple audio channels using a single SetParmVal
   * message (e.g. mute all analog outputs, or a subset of analog outputs). This
   * parameter is to be used instead of {@link ArgValId.AudioChannelNumberDst} and
   * must always be specified before the ChannelControlValueDST parameter.
   *
   * Notification messages also use this parameter (instead of using
   * {@link ArgValId.AudioChannelNumberDst}) when audio control values are changed by
   * automation controls because multiple audio channels may be affected by a
   * single automation control.
   *
   * The maximum number of audio channels for all audio streams is given by
   * {@link AudioInfo.AudioChannelMax}.
   */
  ChannelBitmapDST = 0x09,
  /**
   * This parameter is used with the {@link ChannelControlValueSRC} parameter to set
   * the control values for multiple audio channels using a single SetParmVal
   * message. This parameter is to be used instead of
   * {@link ArgValId.AudioChannelNumberSrc} and must always be
   * specified before the {@link ChannelControlValueSRC} parameter.
   *
   * Notification messages also use this parameter (instead of using
   * {@link ArgValId.AudioChannelNumberSrc}) when audio control values
   * are changed by automation controls because multiple audio channels may be
   * affected by a single automation control.
   *
   * See {@link ChannelBitmapDST} parameter for more details.
   */
  ChannelBitmapSRC = 0x0a,
  /**
   * USBD audio channel name for DST channels (7-bit ASCII string).
   * Maximum length is given by {@link AudioInfo.USBDChannelNameMax}.
   */
  USBDChannelNameDST = 0x10,
  /**
   * USBD audio channel name for SRC channels (7-bit ASCII string).
   * Maximum length is given by {@link AudioInfo.USBDChannelNameMax}.
   */
  USBDChannelNameSRC = 0x11,
}
