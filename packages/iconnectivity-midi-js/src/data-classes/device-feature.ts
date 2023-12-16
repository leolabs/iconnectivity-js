/**
 * This data class contains parameters related to device features.
 */
export enum DeviceFeature {
  /**
   * Currently loaded preset number (1 – N) (1 byte). This is a read-only
   * parameter that cannot be used to change presets; use the SaveLoad
   * commands to change presets. Maximum value is given by
   * `DeviceInfo:PresetMax`.
   */
  PresetNumber = 0x01,
  /**
   * Preset name (7-bit ASCII string). Maximum length is given by
   * `DeviceInfo:PresetNameMax`. Can be used to read/write the currently loaded
   * preset name in the working area or the shadow area. Can also be used to
   * read (but not write) preset names from non-volatile storage.
   *
   * When reading/writing the preset name in the working area `ArgID:Area` can be
   * used but is not required. When reading/writing the preset name in the shadow
   * area `ArgID:Area` is required. In both cases, `ArgID:PresetID` must not be used.
   *
   * When reading the preset name from non-volatile storage `ArgID:Area` can be
   * used but will be ignored. However, `ArgID:PresetID` is required.
   */
  PresetName = 0x02,
  /**
   * Currently loaded preset user data. Free field for storing user data (all bytes
   * must be in the range 0x00 – 0x7F).
   * ```plain
   * Bytes 1: index (i.e. starting address)
   * Bytes 2 – N: user data
   * ```
   * The first byte is an index into the user data field (i.e. the starting address).
   * The remaining bytes are the user data. RetParmVal will always return the
   * entire user data field (index is always 0, user data is always
   * PresetUserDataMax bytes in length). SetParmVal can use a non-zero value
   * for the offset byte and can write just a portion of the user data field. Maximum
   * length is given by `DeviceInfo:PresetUserDataMax`.
   */
  PresetUserData = 0x03,
  /**
   * Currently active scene number (1 – N) (1 byte). This parameter can be used
   * to change the active scene in the currently loaded preset. Maximum value is
   * given by `DeviceInfo:SceneMax`.
   */
  SceneNumber = 0x04,
  /**
   * Failover system arm status (1 byte). Set to 1 to enable the failover system.
   * Set to 0 to disable the failover system. Arming the failover system will clear
   * the alarm status (see FailoverAlarmStatus).
   * - 0 = failover system is not armed
   * - 1 = failover system is armed
   */
  FailoverArmStatus = 0x10,
  /**
   * Failover system alarm status (1 byte). Alarm is set if the failover system has
   * detected a failure in the master computer and has switched to the backup
   * computer. Write 0 to clear the alarm status. Alarm cannot be set by writing 1.
   * - 0 = alarm is off (no failure on master detected)
   * - 1 = alarm is on (failure on master detected)
   */
  FailoverAlarmStatus = 0x11,
  /**
   * State of USB device ports (4 bytes):
   * - Byte 1: USB device port #1 audio status.
   * - Byte 2: USB device port #1 MIDI status.
   * - Byte 3: USB device port #2 audio status.
   * - Byte 4: USB device port #2 MIDI status.
   *
   * Read-only. Each byte will be one of the following values:
   * - 0 = Host is not connected or is not sending any USB data.
   * - 1 = Host has enumerated the device and is sending USB start of frame.
   * - 2 = Host is sending data to USB audio endpoint or MIDI OUT endpoint.
   * - 3 = Host is sending non-zero data to the specified audio channel or sending any valid MIDI data to the specified MIDI port.
   */
  FailoverUSBPortStatus = 0x12,
  /**
   * Failover system operating mode (1 byte):
   *
   * 1 = Single master mode. The master uses USB port #1 for audio/MIDI data
   * and failover trigger information. The backup uses USB port #2 for audio/MIDI
   * data only. When failure occurs on USB port #1 the backup on USB port #2
   * becomes active. Switching back to the master computer (manually or
   * automatically) occurs once the master computer returns to normal operating
   * state.
   *
   * 2 = Dual master mode. The master and backup alternate between USB #1
   * and USB port #2. Both USB ports are used for audio/MIDI data and failover
   * trigger information. When failure occurs on USB port #1, the backup on USB
   * port #2 becomes the new master and USB port #1 becomes the new backup.
   */
  FailoverOpMode = 0x13,
  /**
   * Failover system configuration flags (1 byte):
   * - bits 7 - 5: reserved (always 0).
   * - bit 4: set if failover system should monitor audio tone channel to detect signal
   *   overflow (i.e. white noise that can occur when using bad USB cables).
   * - bit 3: set if failover system should send MIDI panic when
   *   changing scenes.
   * - bit 2: set if failover system should clear the alarm status when arming the
   *   system.
   * - bit 1: set if the failover system should select scene A when automatically
   *   arming itself (only used if bit 0 is also set and FailoverOpMode = 1).
   * - bit 0: set if the failover system should automatically arm itself when the
   *   master computer is stable.
   */
  FailoverConfigFlags = 0x14,
  /**
   * Trigger mode for switching from master to backup (1 byte):
   * - 1: audio only, master is stable if audio meets the failover trigger.
   * - 2: MIDI only, master is stable if MIDI meets the failover trigger.
   * - 3: audio or MIDI, master is stable if either audio or MIDI meets the failover
   *   trigger.
   * - 4: audio and MIDI, master is stable only if both audio and MIDI meet the
   *   failover trigger.
   */
  FailoverTriggerMode = 0x15,
  /** Failover trigger parameter block for audio. */
  FailoverAudioTrigger = 0x16,
  /** Failover trigger parameter block for MIDI */
  FailoverMIDITrigger = 0x17,
  /**
   * Maximum level allowed for audio tone channel. Values greater than this will
   * trigger the failover system to automatically mute all line outputs if bit 4 is set
   * in FailoverConfigFlags. Parameter value is in dB using 8.8 format (16-bit
   * value encoded in 3 bytes, 16x3 format). Maximum value is 0 dB (0x0000),
   * minimum value is -64 dB (0xC000) with 0.5 dB (0x0080) resolution.
   */
  FailoverToneVolumeMax = 0x18,
  /**
   * System event parameter block for hardware control input going to active state.
   * This parameter requires the HWPortID ArgID to specify the hardware control port
   * and the SceneID ArgID to specify the scene.
   */
  SysEvntHardwareCtrlInputActive = 0x20,
  /**
   * System event parameter block for hardware control input going to inactive
   * state. This parameter requires the HWPortID ArgID to specify the
   * hardware control port and the SceneID ArgID to specify the scene.
   */
  SysEvntHardwareCtrlInputInactive = 0x21,
  /**
   * System event parameter block for failover system going to arm state.
   * This parameter requires the SceneID ArgID to specify the scene.
   */
  SysEvntFailoverArm = 0x22,
  /**
   * System event parameter block for failover system going to disarm state.
   * This parameter requires the SceneID ArgID to specify the scene.
   */
  SysEvntFailoverDisarm = 0x23,
  /**
   * System event parameter block for failover alarm going to set state.
   * This parameter requires the SceneID ArgID to specify the scene.
   */
  SysEvntFailoverAlarmSet = 0x24,
  /**
   * System event parameter block for failover alarm going to clear state.
   * This parameter requires the SceneID ArgID to specify the scene.
   */
  SysEvntFailoverAlarmClear = 0x25,
  /** System event parameter block for preset being loaded. */
  SysEvntPresetLoad = 0x26,
  /**
   * System event parameter block for scene being made active.
   * This parameter requires the SceneID ArgID to specify the scene.
   */
  SysEvntSceneActive = 0x27,
}
