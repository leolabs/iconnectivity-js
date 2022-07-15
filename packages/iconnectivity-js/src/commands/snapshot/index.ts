export enum SnapshotCommand {
  GetSnapshotGlobalParm = 0x66,
  RetSnapshotGlobalParm = 0x67,
  GetSnapshotParm = 0x68,
  RetSetSnapshotParm = 0x69,
  GetSnapshotList = 0x6a,
  RetSetSnapshotList = 0x6b,
  CreateSnapshot = 0x6c,
  ApplySnapshot = 0x6d,
  ApplySnapshotList = 0x6e,
}

export enum SnapshotType {
  MidiPatchbay = 0x01,
  AudioPatchbay = 0x02,
  AudioControl = 0x03,
  MixerControl = 0x04,
  Scene = 0x7f,
}
