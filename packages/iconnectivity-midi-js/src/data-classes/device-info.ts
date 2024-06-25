/**
 * This data class contains many read-only global parameters for a device and is also used to set the device
 * name. This data class should always be one of the first messages sent to a device.
 */
export enum DeviceInfo {
  /** Product name (7-bit ASCII string). */
  ProductName = 0x01,
  /** Manufacturer (7-bit ASCII string). */
  MfgName = 0x02,
  /** Model number (7-bit ASCII string). */
  ModelNumber = 0x03,
  /** Serial number (7-bit ASCII string). */
  SerialNumber = 0x04,
  /**
   * Firmware version (4 bytes) using the format: Major.Minor.Revision.Beta
   * (where 0 is used in the Beta field for final builds). Examples:
   * ```plain
   * 0x01 0x02 0x03 0x00 = 1.2.3
   * 0x02 0x00 0x0B 0x04 = 2.0.11b4
   * ```
   */
  FirmwareVersion = 0x05,
  /** Hardware version (2 bytes) using the format: Major.Minor. Examples:
   * ```plain
   * 0x01 0x02 = 1.2
   * 0x02 0x22 = 2.34
   * ```
   */
  HardwareVersion = 0x06,
  /** Maximum length allowed for device name (`DeviceInfo:DevName`) (1 byte). */
  DevNameMax = 0x07,
  /** Max length allowed for device user data (`DeviceInfo:DevUserData`) (1 byte). */
  DevUserDataMax = 0x08,
  /** Number of DIN IN ports (0 – N) (1 byte). */
  DINInPortCount = 0x09,
  /** Number of DIN OUT ports (0 – N) (1 byte). */
  DINOutPortCount = 0x0a,
  /** Number of USB device ports (0 – N) (1 byte). */
  USBDPortCount = 0x0b,
  /** Number of USB host controller ports (0 – N) (1 byte). */
  USBHPortCount = 0x0c,
  /** Number of Ethernet ports (0 – N) (1 byte). */
  EthPortCount = 0x0d,
  /** Number of control ports (0 – N) (1 byte). */
  CtrlPortCount = 0x0e,
  /** Maximum length allowed for hardware port name (`HardwareInfo:HWPortName`) (1 byte). */
  HWPortNameMax = 0x0f,
  /**
   * Maximum length allowed for sysex messages sent to the device (2 bytes,
   * 14x2 format). If the host needs to send a sysex message to the device that
   * is longer than this value the host will need to split the message into
   * multiple smaller messages.
   */
  DevInSizeMax = 0x10,
  /**
   * Maximum length allowed for sysex messages sent to the device (2 bytes,
   * 14x2 format). If the host needs to send a sysex message to the device that
   * is longer than this value the host will need to split the message into
   * multiple smaller messages.
   */
  DevOutSizeMax = 0x11,
  /**
   * Device’s current operating mode (1 byte):
   * 0 = bootloader mode, 1 = application mode
   */
  DevOpMode = 0x12,
  /**
   * Info regarding the MIDI port that this message is sent on (4 bytes):
   * ```plain
   * Byte 1: MIDI port ID (1 – N)
   * Byte 2: MIDI port type:
   *   0x01 = DIN
   *   0x02 = USB device
   *   0x03 = USB host
   *   0x04 = Ethernet
   * Bytes 3-4: MIDI port detail, depends on MIDI port type:
   *   DIN:
   *     Byte 3: DIN IN port (1 – N)
   *     Byte 4: DIN OUT port (1 – N)
   *   USB device:
   *     Byte 3: USB device port (1 - N)
   *     Byte 4: MIDI port (1 - 16)
   *   USB host:
   *     Byte 3: USB host controller (1 - N)
   *     Byte 4: USB host controller port (1 - N)
   *   Ethernet:
   *     Byte 3: Ethernet port (1 - N)
   *     Byte 4: RTP-MIDI session (1 - N)
   * ```
   */
  DevMIDIPortInfo = 0x13,
  /** Maximum number of presets supported (1 – N) (1 byte). */
  PresetMax = 0x14,
  /** Maximum length allowed for preset names (`DeviceFeature:PresetName`) (1 byte). */
  PresetNameMax = 0x15,
  /** Maximum length allowed for preset user data (`DeviceFeature:PresetUserData`) (1 byte). */
  PresetUserDataMax = 0x16,
  /**
   * Maximum number of scenes supported per preset (1 – N) (1 byte).
   * A value of 1 indicates a device that does not support scene changes.
   */
  SceneMax = 0x17,
  /** Maximum number of shadow areas supported (0 – N) (1 byte). */
  ShadowAreaMax = 0x18,
  /**
   * Notification timeout, in seconds (1 byte). If a host registers for automatic
   * updates using the Notification command, the host must ensure that it
   * sends a SysEx message to the device at regular intervals otherwise the
   * device will assume the host is not there and will stop sending notification
   * messages. Example:
   * ```
   * Timeout = 5 // host should send a sysex message every 5 seconds (or sooner) to continue receiving automatic updates
   * ```
   */
  NotificationTimeout = 0x19,
  /**
   * Notification classes supported by the device (one byte for each class that
   * the device supports). See Notification command for a list of classes.
   */
  NotificationClassSupport = 0x1a,
  /** Maximum level (pixel value) for display (1 – N) (1 byte). */
  DisplayLevelMax = 0x1b,
  /**
   * Maximum brightness level for display (0 – N) (1 byte). 0 if display
   * brightness cannot be set using `DeviceInfo:DisplayBrightness`.
   */
  DisplayBrightnessMax = 0x1c,
  /**
   * Maximum contrast level for display (0 – N) (1 byte). 0 if display contrast
   * cannot be set using `DeviceInfo:DisplayContrast`.
   */
  DisplayContrastMax = 0x1d,
  /**
   * Display support flags (1 byte):
   * ```plain
   * bits 7 - 1: reserved (always 0).
   * bit 0: set if display can be inverted (black = white, white = black).
   * ```
   */
  DisplaySupportFlags = 0x1e,
  /**
   * System event support flags (2 bytes):
   * ```plain
   * Byte 1:
   *   bits 7 - 4: reserved (always 0).
   *   bit 3: set if scene change events are supported (see `DeviceFeature:SysEvntScene` parameters).
   *   bit 2: set if preset load events are supported (see `DeviceFeature:SysEvntPreset` parameters).
   *   bit 1: set if failover events are supported (see `DeviceFeature:SysEvntFailover` parameters).
   *   bit 0: set if hardware control input events are supported (see `DeviceFeature:SysEvntHardwareCtrlInput` parameters).
   * Byte 2:
   *   bits 7-0: reserved (always 0).
   * ```
   */
  SystemEventSupportFlags = 0x1f,
  /**
   * Device name (7-bit ASCII string). This name will be used for the Bonjour
   * name of the device on a network. Note that the actual name used on the
   * network may be different if there is a name conflict following Bonjour name
   * resolution (see `HardwareInfo:EthDevName`). Maximum length is given by
   * `DeviceInfo:DevNameMax`.
   */
  DevName = 0x40,
  /**
   * Device user data. Free field for storing user data (all bytes must be in the range 0x00 – 0x7F).
   * ```plain
   * Bytes 1: index (i.e. starting address)
   * Bytes 2 – N: user data
   * ```
   * The first byte is an index into the user data field (i.e. the starting address).
   * The remaining bytes are the user data. RetParmVal will always return the
   * entire user data field (index is always 0, user data is always
   * DevUserDataMax bytes in length). SetParmVal can use a non-zero value
   * for the offset byte and can write just a portion of the user data field.
   * Maximum length is given by `DeviceInfo:DevUserDataMax`.
   */
  DevUserData = 0x41,
  /** Brightness level for display (1 – `DeviceInfo:DisplayBrightnessMax`) (1 byte). */
  DisplayBrightness = 0x42,
  /** Contrast level for display (1 – `DeviceInfo:DisplayContrastMax`) (1 byte). */
  DisplayContrast = 0x43,
  /**
   * Display enable flags (1 byte). These bits can only be set if the matching bit
   * is set in `DeviceInfo:DisplaySupportFlags`:
   * ```plain
   * bits 7 - 1: reserved (always 0).
   * bit 0: set if the display is inverted, clear if display is not inverted.
   * ```
   */
  DisplayEnableFlags = 0x44,
  /**
   * Timeout for display (0 – 127) (1 byte) in minutes. Use 1-127 to turn off
   * display after 1-127 minutes of inactivity. Use 0 to never turn off display.
   */
  DisplayTimeout = 0x45,
}

export enum OpMode {
  Bootloader = 0,
  Application = 1,
}
