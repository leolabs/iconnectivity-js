export enum AdvancedMidiProcessorCommand {
  GetAMPGlobalParm = 0x72,
  RetAMPGlobalParm = 0x73,
  GetAMPAlgorithmParm = 0x74,
  RetSetAMPAlgorithmParm = 0x75,
  GetAMPOperatorParm = 0x76,
  RetSetAMPOperatorParm = 0x77,
  GetAMPCustomRoute = 0x78,
  RetSetAMPCustomRoute = 0x79,
  GetAMPLookupTable = 0x7a,
  RetSetAMPLookupTable = 0x7b,
  GetAMPPortInfo = 0x7c,
  RetSetAMPPortInfo = 0x7d,
}
