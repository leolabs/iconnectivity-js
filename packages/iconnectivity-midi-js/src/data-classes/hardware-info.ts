/**
 * This data class contains parameters related to hardware ports. The DeviceInfo data class returns
 * information regarding the number and types of hardware ports that the device supports. Hardware port
 * type and port ID are required arguments for all parameters in this data class. MIDIPortID is required for
 * USBH-MIDI parameters.
 */
export enum HardwareInfo {
  /** Hardware port name (7-bit ASCII string). Maximum length is given by `DeviceInfo:HWPortNameMax`. */
  HWPortName = 0x01,
  /**
   * USB device port flags (1 byte):
   * - bits 7 - 3: reserved (always 0).
   * - bit 2: set if this port supports audio and MIDI, clear if this port only supports MIDI
   * - bit 1: set if this port supports high-speed (480 Mbit), clear if this port only supports full-speed (12 Mbit)
   * - bit 0: set if this port supports firmware updates when the device is operating in bootloader mode
   */
  USBDFlags = 0x10,
  /**
   * Indicates if a host is connected to this USB device port and has enumerated
   * the device (1 byte):
   * - 0 = no host connected or device not enumerated
   * - 1 = host connected and device is enumerated
   */
  USBDConnect = 0x11,
  /** Maximum number of MIDI ports supported on this USB device port (1 – 16) (1 byte). */
  USBDMIDIPortMax = 0x12,
  /** Number of MIDI ports to use on this USB device port (1 – `USBDMIDIPortMax`) (1 byte). */
  USBDMIDIPortCount = 0x13,
  /**
   * Flag to indicate if audio is enabled on this USB device port (1 byte). Is only
   * used, and can only be enabled, if bit 2 is set in `USBDFlags`.
   * - 0 = audio is disabled
   * - 1 = audio is enabled
   */
  USBDAudioEnable = 0x14,
  /** The number of USB jacks on the interface for this host controller (1 – N) (1 byte). */
  USBHJackCount = 0x20,
  /** Maximum number of MIDI ports supported on this host controller (1 – N) (1 byte). */
  USBHMIDIPortMax = 0x21,
  /** Number of MIDI ports to use on this host controller (1 – `USBHMIDIPortMax`) (1 byte). */
  USBHMIDIPortCount = 0x22,
  /** Maximum number of ports to host on multi-port MIDI devices connected to this host controller (1 – `USBHMIDIPortCount`) (1 byte). */
  USBHMIDIMultiMax = 0x23,
  /**
   * Flag to enable routing MIDI events between ports on multi-port MIDI devices
   * connected to this host controller (1 byte).
   * - 0 = routing is disabled (MIDI routing matrix is not used for these ports)
   * - 1 = routing is enabled (MIDI routing matrix is used for these ports)
   */
  USBHMIDIMultiRoute = 0x24,
  /**
   * Hosted device’s MIDI IN port name (7-bit ASCII string). Devices that do not
   * support names for MIDI ports in their USB device descriptor will return an
   * empty string. This parameter requires the MIDIPortID ArgID to specify the
   * port number of the device (1 – `USBHMIDIPortCountIn`).
   */
  USBHMIDIPortNameIn = 0x26,
  /**
   * Hosted device’s MIDI IN port name (7-bit ASCII string). Devices that do not
   * support names for MIDI ports in their USB device descriptor will return an
   * empty string. This parameter requires the MIDIPortID ArgID to specify the
   * port number of the device (1 – `USBHMIDIPortCountOut`).
   */
  USBHMIDIPortNameOut = 0x27,
  /**
   * Hosted device’s USB vendor ID (16-bit value encoded in 3 bytes, 16x3
   * format). 0 if no device is hosted.
   */
  USBHMIDIVID = 0x28,
  /**
   * Hosted device’s USB product ID (16-bit value encoded in 3 bytes, 16x3
   * format). 0 if no device is hosted.
   */
  USBHMIDIPID = 0x29,
  /** Hosted device’s vendor name from USB descriptor (7-bit ASCII string). */
  USBHMIDIVName = 0x2a,
  /** Hosted device’s product name from USB descriptor (7-bit ASCII string). */
  USBHMIDIPName = 0x2b,
  /**
   * Hosted device’s serial number from USB descriptor (7-bit ASCII string).
   * Most USB-MIDI devices do not have a serial number in the USB descriptor.
   */
  USBHMIDISerialNum = 0x2c,
  /**
   * Number of MIDI IN ports supported by the hosted device (1 – 16) (1 byte).
   * 0 if no device is hosted.
   */
  USBHMIDIPortCountIn = 0x2d,
  /**
   * Number of MIDI OUT ports supported by the hosted device (1 – 16) (1 byte).
   * 0 if no device is hosted.
   */
  USBHMIDIPortCountOut = 0x2e,
  /**
   * A unique ID assigned to each hosted device (1 – N) (1 byte). This can be
   * used to distinguish between multiple devices that have the same
   * `USBHMIDIVID` and `USBHMIDIPID` with a blank `USBHMIDISerialNum`. 0 if no
   * device is hosted.
   */
  USBHMIDIIdentifier = 0x2f,
  /**
   * Ethernet MAC address, 48-bit value encoded in 12 bytes using BAx2 format.
   * Example (MAC address = AC:7A:42:12:34:56):
   * 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x02, 0x04, 0x0A, 0x07, 0x0C, 0x0A
   */
  EthMACAddress = 0x30,
  /**
   * Indicates if Ethernet port is connected to a network (1 byte):
   * - 0 = not connected
   * - 1 = connected
   */
  EthConnect = 0x31,
  /**
   * Current (active) IP address, subnet mask, and gateway address (15 bytes).
   * All are four-byte big-endian values encoded in five-bytes (32x5 format).
   * These values are only valid if the Ethernet port is connected to a network, is
   * active, and (if EthIPMode = dynamic) has obtained values from a DHCP
   * server or AutoIP has finished negotiation. Example:
   * ```
   * 0x0A, 0x4F, 0x78, 0x00, 0x08 // current IP address (169.254.0.8)
   * 0x0F, 0x7F, 0x7C, 0x00, 0x00 // current subnet mask (255.255.0.0)
   * 0x0A, 0x4F, 0x78, 0x00, 0x01 // current gateway address (169.254.0.1)
   * ```
   */
  EthCurrentIP = 0x32,
  /**
   * Device name on network (Bonjour name), 7-bit ASCII string, taken from
   * `DeviceInfo:DevName` parameter. `EthDevName` is only valid if the Ethernet
   * port is connected to a network and has finished Bonjour name resolution.
   */
  EthDevName = 0x33,
  /**
   * IP mode (1 byte):
   * - 0 = use static IP (as defined in EthStaticIP)
   * - 1 = use dynamic IP (DHCP or AutoIP if DHCP server is not available)
   */
  EthIPMode = 0x34,
  /**
   * Device IP address, subnet mask, and gateway address to use when
   * EthIPMode = static (15 bytes). All are four-byte big-endian values encoded in
   * five-bytes (32x5 format). Example:
   * ```
   * 0x0C, 0x05, 0x20, 0x02, 0x64 // static IP address (192.168.1.100)
   * 0x0F, 0x7F, 0x7F, 0x7E, 0x00 // static subnet mask (255.255.255.0)
   * 0x0C, 0x05, 0x20, 0x02, 0x01 // static gateway address (192.168.1.1)
   * ```
   */
  EthStaticIP = 0x35,
  /** Maximum number of RTP-MIDI sessions supported on this Ethernet port (1 – N) (1 byte). */
  EthMIDIPortMax = 0x36,
  /** Number of RTP-MIDI sessions to use on this Ethernet port (1 – `EthMIDIPortMax`) (1 byte). */
  EthMIDIPortCount = 0x37,
  /**
   * Control location on product (2 bytes):
   * - Byte 1: control jack number (1 – N).
   * - Byte 2: jack pin number: 1 = tip, 2 = ring.
   */
  CtrlLocation = 0x40,
  /**
   * Control support flags (1 byte):
   * - bits 7 - 2: reserved (always 0).
   * - bit 1: set if this control can be used as an output.
   * - bit 0: set if this control can be used as an input.
   */
  CtrlSupportFlags = 0x41,
  /**
   * Control configuration flags (1 byte):
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if control state should be read and applied on power up (inputs only).
   * - bit 3: set if control is momentary, clear if control is latching.
   * - bit 2: set if control is inverted (normally closed), clear if control is not inverted (normally open).
   * - bit 1: set if this control is an input, clear if this control is an output.
   * - bit 0: set if control is enabled, clear if control is disabled.
   */
  CtrlConfigFlags = 0x42,
  /**
   * Control debounce time (inputs) or hold time (outputs, if momentary flag is set)
   * in milliseconds (1 – 6000) (2 bytes 14x2 format). Can also use 0 to indicate
   * “minimum time supported by device” which may be less than 1 ms.
   */
  CtrlDbncHoldTime = 0x43,
  /**
   * Control state (1 byte):
   * - 0 = control is inactive.
   * - 1 = control is active.
   *
   * Outputs support read and write. Inputs are read-only (writing has no effect).
   * Reading returns the control’s active/inactive status. For toggle controls this is
   * the same state as seen at the control’s input pin. For momentary controls this
   * is the control’s runtime state, not the state as seen at the control’s input pin.
   */
  CtrlState = 0x44,
}

export enum HardwarePortType {
  DINIn = 0x01,
  DINOut = 0x02,
  USBDevice = 0x03,
  USBHostController = 0x04,
  Ethernet = 0x05,
  Control = 0x06,
  AnalogAudio = 0x07,
}
