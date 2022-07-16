import { DeviceInfo } from "./commands/device/get-device";
import { Connection } from "./connection";
import { Data, formatData } from "./util/data";

/** Represents an iConnectivity device with a MIDI input and output */
export class Device extends Connection {
  readonly serialNumber: Data;

  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput,
    public readonly info: DeviceInfo
  ) {
    super(input, output);
    this.serialNumber = info.serialNumber;
  }

  /** The device's serial number as a human-readable string */
  get serialNumberString() {
    return formatData(this.info.serialNumber);
  }
}
