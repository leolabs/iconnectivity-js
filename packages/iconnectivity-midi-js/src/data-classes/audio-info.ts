/**
 * This data class contains global parameters related to the audio capabilities and configuration of a device.
 * Almost everything is an audio port, the exception being clock sources.
 */
export enum AudioInfo {
  /** Total number of audio ports supported by device (1 – N) (1 byte). */
  PortCount = 0x01,
  /** Number of USBD audio ports supported by device (0 – N) (1 byte). */
  USBDPortCount = 0x02,
  /** Number of analog audio ports supported by device (0 – N) (1 byte). */
  AnalogPortCount = 0x03,
  /** Number of mixer audio ports supported by device (0 – N) (1 byte). */
  MixerPortCount = 0x04,
  /** Number of mixer tone generator ports supported by device (0 – N) (1 byte). */
  ToneGeneratorPortCount = 0x05,
  /** Maximum length allowed for audio port name (AudioPortInfo:PortName) (1 byte). */
  AudioPortNameMax = 0x07,
  /**
   * Maximum length allowed for audio channel name
   * (`AudioChannelInfo:ChannelNameDst` and
   * `AudioChannelInfo:ChannelNameSrc`) (1 byte).
   */
  AudioChannelNameMax = 0x08,
  /**
   * Maximum length allowed for USB device audio channel name
   * (`AudioChannelInfo:USBDChannelNameDst` and
   * `AudioChannelInfo:USBDChannelNameSrc`) (1 byte).
   */
  USBDChannelNameMax = 0x09,
  /** The number of audio configurations supported by device (1 – N) (1 byte). */
  AudioConfigCount = 0x0a,
  /**
   * The audio configurations supported by device. Each audio configuration
   * structure consists of two bytes:
   * - Byte 1: configuration ID (1 – N)
   * - Byte 2: audio sample rate (1 – N), value from {@link AudioSampleRate}
   *
   * The number of structures is given by `AudioInfo:AudioConfigCount`. For
   * example, a product that supports four sample rates will return four two-byte
   * audio configuration structures:
   *
   * - 0x01, 0x01: configuration #1 is 44,100 Hz
   * - 0x02, 0x02: configuration #2 is 48,000 Hz
   * - 0x03, 0x03: configuration #3 is 88,200 Hz
   * - 0x04, 0x04: configuration #4 is 96,000 Hz
   */
  AudioConfigSupport = 0x0b,
  /** The number of audio clocks supported by device (1 – N) (1 byte). */
  AudioClockCount = 0x0c,
  /**
   * The audio clock sources supported by device. Each audio clock source
   * structure consists of three bytes:
   * - Byte 1: clock ID (1 – N)
   * - Byte 2: clock type (1 – N), value from {@link AudioClockType}
   * - Byte 3: instance number (1 – N).
   *
   * The number of structures is given by AudioInfo:AudioClockCount. For
   * example, a product that has one internal clock and two USB device ports
   * (each of which can use the connected USB host as a clock master) will
   * return three three-byte audio clock source structures:
   *
   * - 0x01, 0x01, 0x01: clock #1 is internal #1
   * - 0x02, 0x02, 0x01: clock #2 is USB device #1
   * - 0x03, 0x02, 0x02: clock #3 is USB device #2
   */
  AudioClockSupport = 0x0d,
  /**
   * The number of audio channel types supported by device (1 – N) (1 byte).
   * To be used with {@link AudioChannelTypeDetail} parameter.
   */
  AudioChannelTypeCount = 0x0e,
  /**
   * Parameter block containing details about a specific audio channel type that is
   * supported by the device. This parameter requires the `AudioChannelType`
   * ArgID to be set to a value from 1 to `AudioInfo:AudioChannelTypeCount`.
   */
  AudioChannelTypeDetail = 0x0f,
  /**
   * The audio configuration that is currently active for the device (1 –
   * `AudioInfo:AudioConfigCount`) (1 byte). Read-only and may not be the same
   * as `AudioInfo:AudioConfigRestartValue`. Only supports Area 0 (work area).
   */
  AudioConfigCurrentValue = 0x10,
  /**
   * The audio clock source that is currently active for the device (1 –
   * `AudioInfo:AudioClockCount`) (1 byte). Read-only and may not be the same
   * as `AudioInfo:AudioClockRestartValue`. Only supports Area 0 (work area).
   */
  AudioClockCurrentValue = 0x11,
  /**
   * The number of audio frame buffers that audio system currently uses (1 byte).
   * Read-only and may not be the same as
   * `AudioInfo:AudioFrameWaitRestartValue`. Only supports Area 0 (work area).
   */
  AudioFrameWaitCurrentValue = 0x12,
  /**
   * The number of mixer snapshots supported by device (1 – N) (1 byte).
   */
  AudioMixerSnapshotMax = 0x13,
  /**
   * The number of automation controls for audio (ACA) supported by device (0 – N) (1 byte).
   */
  AudioAutomationControlMax = 0x14,
  /**
   * The maximum number of audio channels the device supports on a single
   * audio stream (1 – N) (1 byte).
   */
  AudioChannelMax = 0x15,
  /**
   * The range of values supported for audio frame rate (2 bytes). Used by
   * {@link AudioFrameWaitCurrentValue} and {@link AudioFrameWaitRestartValue}
   * parameters.
   * - Byte 1: minimum frame wait value
   * - Byte 2: maximum frame wait value
   */
  AudioFrameWaitSupport = 0x16,
  /**
   * The selected audio configuration for the device (1 –
   * {@link AudioConfigCount}) (1 byte). Changing the audio configuration
   * requires rebooting the device before the new value becomes active. Read-
   * write and may not be same as {@link AudioConfigCurrentValue}.
   */
  AudioConfigRestartValue = 0x40,
  /**
   * The selected audio clock source for the device (1 –
   * {@link AudioClockCount}) (1 byte). Changing the audio clock source
   * requires rebooting the device before the new value becomes active. Read-
   * write and may not be same as {@link AudioClockCurrentValue}.
   */
  AudioClockRestartValue = 0x41,
  /**
   * The selected number of audio frame buffers for the device (1 byte).
   * Changing this parameter requires rebooting the device before the new value
   * becomes active. Read-write and may not be same as {@link AudioFrameWaitCurrentValue}.
   */
  AudioFrameWaitRestartValue = 0x42,
}

export enum AudioSampleRate {
  SR44100 = 0x01,
  SR48000 = 0x02,
  SR88200 = 0x03,
  SR96000 = 0x04,
}

export enum AudioClockType {
  /** Internal (device is clock master). */
  Internal = 0x01,
  /** USB Device, clock is derived from audio data sent by USB host (USB host is clock master). */
  USB = 0x02,
}
