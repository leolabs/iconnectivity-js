import { Connection } from "./connection";
import { Data, formatData } from "./util/data";

/** Represents an iConnectivity device with a MIDI input and output */
export class Device extends Connection {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput,
    public readonly serialNumber: Data
  ) {
    super(input, output);
  }

  /** The device's serial number as a human-readable string */
  get serialNumberString() {
    return formatData(this.serialNumber);
  }
}
