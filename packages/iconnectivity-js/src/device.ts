import { DeviceInfo } from "./commands/device/get-device";
import { Connection } from "./connection";
import { formatData } from "./util/data";

/** Represents an iConnectivity device with a MIDI input and output */
export class Device extends Connection {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput,
    public readonly info: DeviceInfo
  ) {
    super(input, output);
  }

  get serialNumber() {
    return formatData(this.info.serialNumber);
  }
}
