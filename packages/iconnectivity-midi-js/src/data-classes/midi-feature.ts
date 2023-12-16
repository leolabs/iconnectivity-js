/**
 * This data class contains parameters for advanced MIDI features. All parameters in this data class require an argument value block.
 */
export enum MIDIFeature {
  /** AMP algorithm name (7-bit ASCII string). */
  AMPAlgName = 0x01,
  /**
   * AMP algorithm user data. Free field for storing user data (all bytes must be in
   * the range 0x00 – 0x7F).
   * - Bytes 1: index (i.e. starting address)
   * - Bytes 2-N: user data
   *
   * The first byte is an index into the user data field (i.e. the starting address).
   * The remaining bytes are the user data. RetParmVal will always return the
   * entire user data field (index is always 0, user data is always
   * MIDIInfo:AMPAlgUserDataMax bytes in length). SetParmVal can use a non-
   * zero value for the offset byte and can write just a portion of the user data
   * field.
   */
  AMPAlgUserData = 0x02,
  /** Operator connection block. */
  AMPOpConnection = 0x03,
  /** Operator match function header block. */
  AMPOpMatchHeader = 0x04,
  /** Operator match function 2x8 block for byte 2. */
  AMPOpMatch2x8b2 = 0x05,
  /** Operator match function 2x8 block for byte 3. */
  AMPOpMatch2x8b3 = 0x06,
  /** Operator match function 1x16 block. */
  AMPOpMatch1x16 = 0x07,
  /** Operator modify function header block. */
  AMPOpModifyHeaderBlock = 0x08,
  /** Operator modify function 2x8 block for byte 2. */
  AMPOpModify2x8b2 = 0x09,
  /** Operator modify function 2x8 block for byte 3. */
  AMPOpModify2x8b3 = 0x0a,
  /** Operator modify function 1x16 block. */
  AMPOpModify1x16 = 0x0b,
  /**
   * Bitmap indicating routing for MIDI events entering at the input for this port
   * (BAx2 format). Bit 0 is routing from this port to port #1, bit 1 is routing from
   * this port to port #2, etc. Least significant byte is first, most significant byte is
   * last. The most significant 4 bits of each byte must be 0 which allows 4 ports to
   * be specified per byte. Unused bits should be set to 0. The number of MIDI
   * ports is given in the MIDIInfo:PortCount parameter. The number of bytes (in
   * the bitmap) is an even value so that the bitmap (when unpacked) is a multiple
   * of 8 bits: number of bytes (using INTEGER math) = (((number of MIDI ports - 1) / 8 ) + 1) x 2.
   *
   * Example: device has 20 ports, route MIDI events coming into this port to ports
   * 2, 3, 7, 11-14, 20:
   * ```
   * 0x06 // routing for ports 4 through 1 (ports 3 and 2 are selected)
   * 0x04 // routing for ports 8 through 5 (port 7 is selected)
   * 0x0C // routing for ports 12 through 9 (ports 12 and 11 are selected)
   * 0x03 // routing for ports 16 through 13 (ports 14 and 13 are selected)
   * 0x08 // routing for ports 20 through 17 (port 20 is selected)
   * 0x00 // routing for ports 24 through 21 (padding)
   * ```
   */
  AMPCRMRoute = 0x0c,
  /**
   * AMP lookup table data (all bytes must be in the range 0x00 – 0x7F).
   * - Bytes 1: index (i.e. starting address) (0 – 63).
   * - Bytes 2-N: lookup table data (0x00 – 0x7F).
   *
   * The first byte is an index into this portion of the lookup table (i.e. the starting
   * address for this portion). The remaining bytes are the lookup table data.
   * RetParmVal will always return all 64 bytes for this portion of the lookup table
   * (index is always 0, lookup table data is always 64 bytes in length).
   * SetParmVal can use a non-zero value for the offset byte and can write just a
   * portion of the lookup table.
   */
  AMPLUTData1 = 0x0d,
  /**
   * AMP lookup table data (all bytes must be in the range 0x00 – 0x7F).
   * - Bytes 1: index (i.e. starting address) (0 – 63).
   * - Bytes 2-N: lookup table data (0x00 – 0x7F).
   *
   * The first byte is an index into this portion of the lookup table (i.e. the starting
   * address for this portion). The remaining bytes are the lookup table data.
   * RetParmVal will always return all 64 bytes for this portion of the lookup table
   * (index is always 0, lookup table data is always 64 bytes in length).
   * SetParmVal can use a non-zero value for the offset byte and can write just a
   * portion of the lookup table.
   */
  AMPLUTData2 = 0x0e,
  /**
   * Panic enable flags (1 byte):
   * - bits 7 - 2: reserved (always 0).
   * - bit 1: set if Panic message is sent automatically when changing presets.
   * - bit 0: set if Panic message can be sent manually from front panel.
   *
   * Panic message can also be automatically sent when changing scenes (for
   * devices that support failover). See the Automatic Failover section for more
   * info. Panic message can also be sent using System Events.
   */
  PanicEnable = 0x10,
  /**
   * Panic message flags (1 byte):
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if Pitch Bend Off message is sent (0xEn 00 40)
   * - bit 3: set if All Notes Off message is sent (0xBn 0x7B 0x00).
   * - bit 2: set if Reset Controls messages is sent (0xBn 0x79 0x00).
   * - bit 1: set if All Sound Off message is sent (0xBn 0x78 0x00).
   * - bit 0: set if Sustain Pedal Off message is sent (0xBn 0x40 0x00).
   */
  PanicMessages = 0x11,
  /**
   * Bitmask indicating which MIDI channels to use for sending messages
   * (0x0001 = MIDI channel 1, 0x0002 = MIDI channel 2 … 0x8000 = MIDI
   * channel 16). More than 1 bit can be set (16-bit value encoded in 3 bytes,
   * 16x3 format).
   */
  PanicChannels = 0x12,
  /**
   * Bitmap indicating which MIDI ports to route Panic message to (BAx2 format).
   * Each bit represents a MIDI port output. Bit 0 is routing to port #1, bit 1 is
   * routing to port #2, etc. Least significant byte is first, most significant byte is
   * last. The most significant 4 bits of each byte must be 0 which allows 4 ports to
   * be specified per byte. Unused bits should be set to 0. The number of MIDI
   * ports is given in the MIDIInfo:PortCount parameter. The number of bytes (in
   * the bitmap) is an even value so that the bitmap (when unpacked) is a multiple
   * of 8 bits: number of bytes (using INTEGER math) = (((number of MIDI ports - 1)
   * / 8 ) + 1) x 2.
   *
   * Example: device has 20 ports, route Panic message to ports 2, 3, 7, 11-14, 20:
   * ```
   * 0x06 // routing for ports 4 through 1 (ports 3 and 2 are selected)
   * 0x04 // routing for ports 8 through 5 (port 7 is selected)
   * 0x0C // routing for ports 12 through 9 (ports 12 and 11 are selected)
   * 0x03 // routing for ports 16 through 13 (ports 14 and 13 are selected)
   * 0x08 // routing for ports 20 through 17 (port 20 is selected)
   * 0x00 // routing for ports 24 through 21 (padding)
   * ```
   */
  PanicRoute = 0x13,
  /**
   * Name to use for MIDI-Gob (7-bit ASCII string). Maximum length is given by `MIDIInfo:MIDIGobNameMax`.
   */
  GobName = 0x14,
  /**
   * MIDI data for MIDI-Gob (BAx2 format). Length is always 2 x
   * `MIDIInfo:MIDIGobDataMax` after BAx2 encoding even if `GobLength` is less
   * than `MIDIInfo:MIDIGobDataMax` when reading/writing this parameter.
   */
  GobData = 0x15,
  /**
   * Length of valid data in GobData parameter (0 – `MIDIInfo:MIDIGobDataMax`)
   * (1 byte). MIDI-Gobs can contain up to `MIDIInfo:MIDIGobDataMax` bytes of
   * data but they may use less than that.
   */
  GobLength = 0x16,
  /**
   * Pointer to next MIDI-Gob in linked list (1 – `MIDIInfo:MIDIGobMax`) (1 byte).
   * Use 0 if not using links.
   */
  GobNext = 0x17,
}
