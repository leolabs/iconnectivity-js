export enum ProductID {
  /** iConnectMIDI (does not support the commands in this library) */
  MIDI = 0x01,
  /** mio10 */
  Mio10 = 0x02,
  /** mio */
  Mio = 0x03,
  /** iConnectMIDI1 */
  MIDI1 = 0x04,
  /** iConnectMIDI2+ */
  MIDI2Plus = 0x05,
  /** iConnectMIDI4+ */
  MIDI4Plus = 0x06,
  /** iConnectAUDIO4+ */
  AUDIO4Plus = 0x07,
  /** iConnectAUDIO2+ */
  AUDIO2Plus = 0x08,
  /** mio2 */
  Mio2 = 0x09,
  /** mio4 */
  Mio4 = 0x0a,
  /** PlayAUDIO12 */
  PlayAUDIO12 = 0x0b,
  /** ConnectAUDIO2/4 */
  ConnectAudio2Or4 = 0x0d,
}
