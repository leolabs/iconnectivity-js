/**
 * This data class contains global parameters related to the MIDI capabilities and configuration of a device.
 */
export enum MIDIInfo {
  /** Total number of MIDI ports supported by device (1 – N) (1 byte). */
  PortCount = 0x01,
  /** Number of DIN MIDI ports supported by device (0 – N) (1 byte). */
  DINPortCount = 0x02,
  /** Number of (internal) MIDI control ports supported by device (0 – N) (1 byte). */
  CtrlPortCount = 0x03,
  /** Number of USBD MIDI ports supported by device (0 – N) (1 byte). */
  USBDPortCount = 0x04,
  /** Number of USBH MIDI ports supported by device (0 – N) (1 byte). */
  USBHPortCount = 0x05,
  /** Number of RTP-MIDI sessions supported by device (0 – N) (1 byte). */
  EthPortCount = 0x06,
  /** Maximum length allowed for MIDI port name (`MIDIPortInfo:PortNameIn` & `PortNameOut`) (1 byte). */
  MIDIPortNameMax = 0x07,
  /** Maximum length allowed for USB device MIDI port name (`MIDIPortInfo:USBDPortName`) (1 byte). */
  USBDPortNameMax = 0x08,
  /**
   * Maximum length allowed for Ethernet session name
   * (`MIDIPortInfo:EthSesnName`) and remote session name
   * (`MIDIPortInfo:EthSesnNameR`) (1 byte).
   */
  EthSesnNameMax = 0x09,
  /**
   * MIDI port feature flags (1 byte):
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if AMP is supported.
   * - bit 3: set if CCProcessor is supported.
   * - bit 2: set if MIDI remap for channel messages is supported.
   * - bit 1: set if MIDI filter for channel messages is supported.
   * - bit 0: set if MIDI filter for system messages is supported.
   */
  PortFeatureFlags = 0x0a,
  /** Maximum number of AMP algorithms supported by device (1 byte). */
  AMPAlgMax = 0x0b,
  /** Maximum number of AMP operators supported by device (1 byte). */
  AMPOpMax = 0x0c,
  /** Maximum number of AMP custom route maps supported by device (1 byte). */
  AMPCRMMax = 0x0d,
  /** Maximum number of AMP lookup tables supported by device (1 byte). */
  AMPLUTMax = 0x0e,
  /** Maximum number of AMP operators-per-algorithm supported by device (1 byte). */
  AMPOPAMax = 0x0f,
  /** Maximum length allowed for AMP algorithm name (1 byte). */
  AMPAlgNameMax = 0x10,
  /** Maximum number of control change processors supported by device for each MIDI port (1 byte). */
  CCProcessorMax = 0x12,
  /** Maximum number of MIDI event icons supported by device (1 byte). */
  PortMonitorDetailIconMax = 0x13,
  /**
   * Panic support flags (1 byte):
   * - bits 7 - 2: reserved (always 0).
   * - bit 1: set if Panic message can be sent automatically when changing presets.
   * - bit 0: set if Panic message can be sent manually from front panel.
   *
   * Panic message can also be automatically sent when changing scenes (for
   * devices that support failover). See the Automatic Failover section for more
   * info.
   */
  PanicSupportFlags = 0x14,
  /**
   * Automation Control Port support flags (2 bytes):
   * - Byte 1:
   *   - bit 7: reserved (always 0).
   *   - bit 6: set if MIDI-Gobs can be sent using automation control port.
   *   - bit 5: set if Panic message can be sent using automation control port.
   *   - bit 4: set if Failover arm/disarm state can be changed and Failover Alarm can be cleared using automation control port.
   *   - bit 3: set if audio controls can be changed using automation control port (see `AudioAutomationInfo` data class).
   *   - bit 2: set if mixer snapshots can be changed using automation control port (see `MIDIPortInfo:MixerSnapshotSelector`).
   *   - bit 1: set if scenes can be changed using automation control port (see `MIDIPortInfo:SceneSelector`).
   *   - bit 0: set if presets can be changed using automation control port (see `MIDIPortInfo:PresetSelector`).
   * - Byte 2:
   *   - bits 7-1: reserved (always 0).
   *   - bit 0: set if hardware control port outputs can be changed using automation control port.
   */
  AutomationContrPortSupportFlags = 0x15,
  /** Maximum number of MIDI-Gobs supported by device (1 byte). */
  MIDIGobMax = 0x17,
  /** Maximum length allowed for MIDI-Gob name (1 byte). */
  MIDIGobNameMax = 0x18,
  /** Maximum length allowed for data in one MIDI-Gob (1 byte). */
  MIDIGobDataMax = 0x19,
  /** Maximum number of route processor blocks supported by device (1 byte). */
  RouteProcessBlockMax = 0x1a,
  /** Maximum length allowed for route processor block name (1 byte). */
  RouteProcessBlockNameMax = 0x1b,
  /**
   * Bitmap indicating activity on all MIDI inputs (length depends on the number of MIDI ports).
   * See `MIDIInfo:PortMonitorDetailEnableIn` and `MIDIPortInfo:PortMonitorDetailIn`.
   */
  PortMonitorIn = 0x20,
  /**
   * Bitmap indicating activity on all MIDI outputs (length depends on the number
   * of MIDI ports). See `MIDIInfo:PortMonitorDetailEnableOut` and
   * `MIDIPortInfo:PortMonitorDetailOut`.
   */
  PortMonitorOut = 0x21,
  /**
   * Bitmap indicating which types of MIDI events are monitored for all MIDI
   * inputs. See `MIDIInfo:PortMonitorIn` and `MIDIPortInfo:PortMonitorDetailIn`.
   */
  PortMonitorDetailEnableIn = 0x40,
  /**
   * Bitmap indicating which types of MIDI events are monitored for all MIDI
   * outputs. See `MIDIInfo:PortMonitorOut` and `MIDIPortInfo:PortMonitorDetailOut`.
   */
  PortMonitorDetailEnableOut = 0x41,
  /**
   * Display settings for MIDI events on all MIDI inputs.
   * `MIDIMonitorEventID` is a required ArgID for this parameter.
   */
  PortMonitorDetailDisplayIn = 0x42,
  /**
   * Display settings for MIDI events on all MIDI outputs.
   * `MIDIMonitorEventID` is a required ArgID for this parameter.
   */
  PortMonitorDetailDisplayOut = 0x43,
}
