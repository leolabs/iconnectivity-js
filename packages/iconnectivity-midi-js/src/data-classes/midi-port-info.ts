/**
 * This data class contains parameters related to specific MIDI ports. MIDI port ID is a required argument for
 * all parameters in this data class. MIDI channel number is a required argument for the FilterChannelIn,
 * FilterChannelOut, RemapChannelIn, and RemapChannelOut parameters.
 */
export enum MIDIPortInfo {
  /** MIDI port type (1 byte), see {@link MIDIPortType}. */
  PortType = 0x01,
  /**
   * MIDI port identifier (2 bytes), depends on PortType:
   * - DIN:
   *   - Byte 1: DIN IN port ID (1 – N, 0 if port has no hardware DIN IN port).
   *   - Byte 2: DIN OUT port ID (1 – N, 0 if port has no hardware DIN OUT port).
   * - USB Device:
   *   - Byte 1: USB device port ID (1 – N).
   *   - Byte 2: MIDI port number (1 – 16).
   * - USB Host Controller :
   *   - Byte 1: USB host controller ID (1 – N).
   *   - Byte 2: USB host controller port (1 – N).
   * - Ethernet :
   *   - Byte 1: Ethernet port (1 - N).
   *   - Byte 2: RTP-MIDI session number (1 - N).
   * - Control:
   *   - Byte 1: Control Port ID (1 – N).
   *   - Byte 2: Control Port Type (1 – N), see Control Port Types table.
   */
  PortIdentifier = 0x02,
  /**
   * MIDI port connection flags (1 byte):
   * - bits 7 - 1: reserved (always 0).
   * - bit 0: set if this port has an active connection.
   *
   * Active USB device ports return 1 for bit 0 if a host is connected. Active USB
   * host ports return 1 for bit 0 if a device is connected. Active Ethernet ports
   * return 1 for bit 0 if a session is connected. Active DIN and Control ports
   * always return 1 for bit 0. Inactive ports (all types) always return 0 for bit 0.
   */
  PortConnectFlags = 0x03,
  /**
   * MIDI port active flags (1 byte):
   * - bits 7 - 1: reserved (always 0).
   * - bit 0: set if this port is active.
   *
   * MIDI ports can be made inactive by limiting the number of MIDI ports
   * available on USB device, USB host controller, and Ethernet ports using the
   * HardwareInfo parameters USBDMIDIPortCount, USBHMIDI
   * PortCount and EthMIDIPortCount respectively. For these types of ports,
   * writing to bit 0 is not supported.
   *
   * For DIN and Control ports, bit 0 can be cleared to make the port inactive.
   *
   * An inactive port still exists inside the device but is non-functional and is not
   * visible to the host via USB or Ethernet. A host application should not display
   * inactive ports to the user (they should be considered non-existent).
   */
  PortActiveFlags = 0x04,
  /**
   * MIDI port support flags (1 byte):
   * - bits 7 - 3: reserved (always 0).
   * - bit 2: set if this port supports running status on MIDI output.
   * - bit 1: set if this port supports MIDI output.
   * - bit 0: set if this port supports MIDI input.
   */
  PortSupportFlags = 0x05,
  /**
   * MIDI port enable flags (1 byte). These bits can only be set if the matching bit
   * is set in PortSupportFlags.
   * - bits 7 - 3: reserved (always 0).
   * - bit 2: set if running status is enabled on MIDI output.
   * - bit 1: set if the MIDI output port is enabled.
   * - bit 0: set if the MIDI input port is enabled.
   */
  PortEnableFlags = 0x06,
  /**
   * Bitmap indicating preset routing for MIDI events entering at the input for this
   * port (BAx2 format). Each bit represents a MIDI port output. Bit 0 is routing
   * from this port to port #1, bit 1 is routing from this port to port #2, etc. Least
   * significant byte is first, most significant byte is last. The most significant 4 bits
   * of each byte must be 0 which allows 4 ports to be specified per byte. Unused
   * bits should be set to 0. The number of MIDI ports is given in the
   * MIDIInfo:PortCount parameter. The number of bytes (in the bitmap) is an
   * even value so that the bitmap (when unpacked) is a multiple of 8 bits:
   * number of bytes (using INTEGER math) = (((number of MIDI ports - 1) / 8 ) + 1) x 2.
   *
   * Example: device has 20 ports, route MIDI events coming into this port to
   * ports 2, 3, 7, 11-14, 20:
   *
   * ```
   * 0x06 // routing for ports 4 through 1 (ports 3 and 2 are selected)
   * 0x04 // routing for ports 8 through 5 (port 7 is selected)
   * 0x0C // routing for ports 12 through 9 (ports 12 and 11 are selected)
   * 0x03 // routing for ports 16 through 13 (ports 14 and 13 are selected)
   * 0x08 // routing for ports 20 through 17 (port 20 is selected)
   * 0x00 // routing for ports 24 through 21 (padding)
   * ```
   *
   * Also see `MIDIPortInfo:PortRouteGlobal`. Preset and global routing bitmaps
   * are OR’d together.
   */
  PortRoutePreset = 0x07,

  /**
   * MIDI port feature enable flags for MIDI input (1 byte). These bits can only be
   * set if the matching bit is set in `MIDIInfo:PortFeatureFlags`:
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if AMP is enabled.
   * - bit 3: set if CCProcessor is enabled.
   * - bit 2: set if MIDI remap for channel messages is enabled.
   * - bit 1: set if MIDI filter for channel messages is enabled.
   * - bit 0: set if MIDI filter for system messages is enabled.
   */
  PortFeatureFlagsIn = 0x08,
  /**
   * MIDI port feature enable flags for MIDI output (1 byte). These bits can only
   * be set if the matching bit is set in `MIDIInfo:PortFeatureFlags`:
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if AMP is enabled.
   * - bit 3: set if CCProcessor is enabled.
   * - bit 2: set if MIDI remap for channel messages is enabled.
   * - bit 1: set if MIDI filter for channel messages is enabled.
   * - bit 0: set if MIDI filter for system messages is enabled.
   */
  PortFeatureFlagsOut = 0x09,
  /**
   * MIDI port name to use for incoming MIDI events (7-bit ASCII string).
   * Maximum length is given by `MIDIInfo:MIDIPortNameMax`.
   */
  PortNameIn = 0x0a,
  /**
   * MIDI port name to use for outgoing MIDI events (7-bit ASCII string).
   * Maximum length is given by `MIDIInfo:MIDIPortNameMax`.
   */
  PortNameOut = 0x0b,
  /**
   * Filter settings for MIDI system messages on MIDI input (2-4 bytes).
   */
  FilterSystemIn = 0x0c,
  /**
   * Filter settings for MIDI system messages on MIDI output (2-4 bytes).
   */
  FilterSystemOut = 0x0d,
  /**
   * Filter settings for MIDI channel messages on MIDI input (2 bytes).
   * `MIDIChannel` is a required ArgID for this parameter.
   */
  FilterChannelIn = 0x0e,
  /**
   * Filter settings for MIDI channel messages on MIDI output (2 bytes).
   * `MIDIChannel` is a required ArgID for this parameter.
   */
  FilterChannelOut = 0x0f,
  /**
   * Remap settings for MIDI channel message on MIDI input (2-14 bytes).
   * `MIDIChannel` is a required ArgID for this parameter.
   */
  RemapChannelIn = 0x10,
  /**
   * Remap settings for MIDI channel message on MIDI output (2-14 bytes).
   * `MIDIChannel` is a required ArgID for this parameter.
   */
  RemapChannelOut = 0x11,
  /**
   * Settings for control change processor on MIDI input (10 bytes).
   * `MIDICCProcessorID` is a required ArgID for this parameter.
   */
  CCProcessorIn = 0x12,
  /**
   * Settings for control change processor on MIDI output (10 bytes).
   * `MIDICCProcessorID` is a required ArgID for this parameter.
   */
  CCProcessorOut = 0x13,
  /**
   * AMP algorithm ID for MIDI input (0 – N) (1 byte). Use 0 for no algorithm.
   */
  AMPAlgorithmIn = 0x14,
  /**
   * AMP algorithm ID for MIDI output (0 – N) (1 byte). Use 0 for no algorithm.
   */
  AMPAlgorithmOut = 0x15,
  /**
   * Bitmap containing MIDI data details for a specific MIDI input port (6 bytes).
   * See `MIDIInfo:PortMonitorIn` and `MIDIInfo:PortMonitorDetailEnableIn`.
   */
  PortMonitorDetailIn = 0x16,
  /**
   * Bitmap containing MIDI data details for a specific MIDI output port (6 bytes).
   * See `MIDIInfo:PortMonitorOut` and `MIDIInfo:PortMonitorDetailEnableOut`.
   */
  PortMonitorDetailOut = 0x17,
  /**
   * Bitmap indicating global routing for MIDI events entering at the input for this
   * port (BAx2 format). See `MIDIPortInfo:PortRoutePreset` for more info.
   */
  PortRouteGlobal = 0x18,
  /** (not documented) */
  PortRouteProcessBlockID = 0x19,
  /**
   * USBD name for MIDI IN port (MIDI data sent from host to device, 7-bit ASCII
   * string). Maximum length is given by `MIDIInfo:USBDPortNameMax`.
   */
  USBDPortNameIn = 0x1e,
  /**
   * USBD name for MIDI OUT port (MIDI data sent from device to host, 7-bit
   * ASCII string). Maximum length is given by `MIDIInfo:USBDPortNameMax`.
   */
  USBDPortNameOut = 0x1f,
  /**
   * Hosted device’s USB vendor ID (16-bit value encoded in 3 bytes, 16x3
   * format). 0 if no device is hosted.
   */
  USBHVID = 0x20,
  /**
   * Hosted device’s USB product ID (16-bit value encoded in 3 bytes, 16x3
   * format). 0 if no device is hosted.
   */
  USBHPID = 0x21,
  /**
   * Hosted device’s vendor name from USB descriptor (7-bit ASCII string).
   */
  USBHVName = 0x22,
  /**
   * Hosted device’s product name from USB descriptor (7-bit ASCII string).
   */
  USBHPName = 0x23,
  /**
   * Hosted device’s serial number from USB descriptor (7-bit ASCII string).
   * Most USB-MIDI devices do not have a serial number in the USB descriptor.
   */
  USBHSerialNum = 0x24,
  /**
   * Number of MIDI IN ports supported by the hosted device (1 – 16) (1 byte).
   * 0 if no device is hosted.
   */
  USBHPortCountIn = 0x25,
  /**
   * Number of MIDI OUT ports supported by the hosted device (1 – 16) (1 byte).
   * 0 if no device is hosted.
   */
  USBHPortCountOut = 0x26,
  /**
   * A unique ID assigned to each hosted device (1 – N) (1 byte). This can be
   * used to distinguish between multiple devices that have the same `USBHVID`
   * and `USBHPID` with a blank `USBHSerialNum`. 0 if no device is hosted.
   */
  USBHIdentifier = 0x27,
  /**
   * MIDI port number on the hosted device (1 – 16) (1 byte).
   * 0 if no device is hosted.
   */
  USBHPortNum = 0x28,
  /**
   * Indicates if the port is reserved for a specific USB-MIDI device (1 byte).
   * Devices are reserved using `USBHVIDR`, `USBHPIDR`, `USBHPortNumR`, and
   * (optionally) `USBHSerialNumR`.
   * - 0 = port is not reserved
   * - 1 = port is reserved
   */
  USBHReserve = 0x29,
  /**
   * Reserved device’s USB vendor ID (16-bit value encoded in 3 bytes, 16x3
   * format). This parameter is used when reserving a device.
   */
  USBHVIDR = 0x2a,
  /**
   * Reserved device’s USB vendor ID (16-bit value encoded in 3 bytes, 16x3
   * format). This parameter is used when reserving a device.
   */
  USBHPIDR = 0x2b,
  /**
   * Reserved device’s vendor name from USB descriptor (7-bit ASCII string).
   * Value should always be copied from `USBHVName`. This parameter is
   * information only and is not used for reserving a device.
   */
  USBHVNameR = 0x2c,
  /**
   * Reserved device’s product name from USB descriptor (7-bit ASCII string).
   * Value should always be copied from `USBHPName`. This parameter is
   * information only and is not used for reserving a device.
   */
  USBHPNameR = 0x2d,
  /**
   * Reserved device’s serial number from USB descriptor (7-bit ASCII string).
   * Most USB-MIDI devices do not have a serial number in the USB descriptor.
   * Set this parameter to an empty string to not use serial number when
   * searching for reserved devices. This parameter is used when reserving a
   * device.
   */
  USBHSerialNumR = 0x2e,
  /**
   * MIDI port number on the reserved device (1 – 16) (1 byte).
   * This parameter is used when reserving a device.
   */
  USBHPortNumR = 0x2f,
  /**
   * Hosted device’s MIDI IN port name from USB descriptor (7-bit ASCII string)
   * for the selected MIDI port number (`USBHPortNum`). Devices that do not
   * support names for MIDI ports in their USB device descriptor will return an
   * empty string.
   */
  USBHPortNameIn = 0x3c,
  /**
   * Hosted device’s MIDI OUT port name from USB descriptor (7-bit ASCII
   * string) for the selected MIDI port number (`USBHPortNum`). Devices that do
   * not support names for MIDI ports in their USB device descriptor will return
   * an empty string.
   */
  USBHPortNameOut = 0x3d,
  /**
   * Reserved device’s MIDI IN port name from USB descriptor (7-bit ASCII
   * string). Value should always be copied from `USBHPortNameIn`. This
   * parameter is information only and is not used for reserving a device.
   */
  USBHPortNameInR = 0x3e,
  /**
   * Reserved device’s MIDI OUT port name from USB descriptor (7-bit ASCII
   * string). Value should always be copied from USBHPortNameOut. This
   * parameter is information only and is not used for reserving a device.
   */
  USBHPortNameOutR = 0x3f,
  /**
   * Session configuration flags (1 byte):
   * - bits 7 - 3: reserved (always 0).
   * - bit 2: initiator mode: 0 = use IP address & port number (`EthIPAddressR` & `EthPortNumberR`), 1 = use session name (`EthSesnNameR`).
   * - bit 1: role: 0 = responder, 1 = initiator.
   * - bit 0: enable: 0 = disabled, 1 = enabled.
   */
  EthSesnFlags = 0x30,
  /**
   * Port number used for this session (16-bit value encoded in 3 bytes, 16x3 format).
   */
  EthPortNumber = 0x31,
  /**
   * Session name (Bonjour name) to use for this session on the network. Actual
   * name used on the network (EthSesnNameN) may be different following
   * Bonjour name resolution. Maximum length is given by
   * `MIDIInfo:EthSesnNameMax`.
   */
  EthSesnName = 0x32,
  /**
   * Actual session name (Bonjour name) for this session on the network (7-bit
   * ASCII string). Only valid if the Ethernet port is connected to a network, is
   * active, and has finished Bonjour name resolution.
   */
  EthSesnNameN = 0x33,
  /**
   * IP address of the device on the other side of this connection (four-byte big-
   * endian value encoded in five-bytes, 32x5 format). Only valid if the session
   * has an active connection. Example:
   * ```
   * 0x0C, 0x05, 0x20, 0x02, 0x64 // IP address (192.168.1.100)
   * ```
   */
  EthIPAddressX = 0x34,
  /**
   * Port number for the device on the other side of this connection (16-bit value
   * encoded in 3 bytes, 16x3 format). Only valid if the session has an active
   * connection.
   */
  EthPortNumberX = 0x35,
  /**
   * Session name (Bonjour name) for the device on the other side of this
   * connection (7-bit ASCII string). Only valid if the session has an active
   * connection.
   */
  EthSesnNameX = 0x36,
  /**
   * IP address to use when initiating a connection (four-byte big-endian value
   * encoded in five-bytes, 32x5 format). Only used when EthSesnFlags role = 1
   * and initiator mode = 0. Example:
   * ```
   * 0x0C, 0x05, 0x20, 0x02, 0x64 // IP address (192.168.1.100)
   * ```
   */
  EthIPAddressR = 0x37,
  /**
   * Port number to use when initiating a connection (16-bit value encoded in 3
   * bytes, 16x3 format). Only used when `EthSesnFlags` role = 1 and initiator
   * mode = 0.
   */
  EthPortNumberR = 0x38,
  /**
   * Session name (Bonjour name) to use when initiating a connection (7-bit
   * ASCII string). Only used when `EthSesnFlags` role = 1 and initiator mode = 1.
   * Maximum length is given by `MIDIInfo:EthSesnNameMax`.
   */
  EthSesnNameR = 0x39,
  /**
   * Program selector parameter block for presets.
   */
  PresetSelector = 0x40,
  /**
   * Program selector parameter block for scenes.
   */
  SceneSelector = 0x41,
  /**
   * Program selector parameter block for mixer snapshots.
   */
  MixerSnapshotSelector = 0x42,
  /**
   * Automation control parameter block for arming failover.
   */
  FailoverArmControl = 0x43,
  /**
   * Automation control parameter block for disarming failover.
   */
  FailoverDisarmControl = 0x44,
  /**
   * Automation control parameter block for clearing failover alarm.
   */
  FailoverClearAlarmControl = 0x45,
  /**
   * Automation control parameter block for sending Panic message.
   */
  PanicControl = 0x46,
  /**
   * Automation control parameter block for sending MIDI-Gobs.
   * This parameter requires the `MIDIGobID` ArgID (1 – `MIDIInfo:MIDIGobMax`).
   */
  MIDIGobControl = 0x47,
  /**
   * Automation control parameter block for hardware control outputs (not used by
   * inputs). This parameter requires the `HWPortID` ArgID (1 – `DeviceInfo:CtrlPortCount`).
   */
  HardwareOutputControl = 0x48,
}

export enum MIDIPortType {
  DIN = 0x01,
  USBDevice = 0x02,
  USBHostController = 0x03,
  Ethernet = 0x04,
  Control = 0x05,
}
