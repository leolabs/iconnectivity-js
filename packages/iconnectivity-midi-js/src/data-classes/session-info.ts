/**
 * This data class is used to discover devices and to establish communication parameters for a session.
 * Sessions are stateless but a device will maintain any session values established on a MIDI port until the
 * device is either reset or a new set of session parameters are established on that MIDI port.
 *
 * The host sends a HstSesnVal message to discover which MIDI ports have devices attached to them and
 * to determine the best MIDI port to establish a communication session. The host can specify a specific
 * product ID (PID), a specific serial number (SNUM), both PID & SNUM, or neither (using wildcards). This
 * message should always be the first query sent to a device because the DevSesnVal response contains
 * useful information about which MIDI port the host should use to establish a communication session with
 * the device.
 *
 * Different parameters are used for the HstSesnVal and DevSesnVal messages. The host should send all
 * host related parameters in the HstSesnVal message. The device will return all device related parameters
 * in the DevSesnVal message.
 */
export enum SessionInfo {
  /**
   * Maximum length allowed for sysex messages sent to the device (2 bytes,
   * 14x2 format). If the host needs to send a sysex message to the device that is
   * longer than this value the host will need to split the message into multiple
   * smaller messages.
   */
  DevInSizeMax = 0x10,
  /**
   * Maximum length for sysex messages that the device can send back to the
   * host (2 bytes, 14x2 format). The host can use this value to allocate a buffer
   * for incoming sysex messages from the device. This value will always be less
   * than or equal to the HstInSizeMax value that the host sent in the HstSesnVal
   * message.
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
}
