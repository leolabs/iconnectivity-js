import { Command, getCommandName } from "./commands";
import { DeviceCommand } from "./commands/device";
import { DeviceInfo } from "./commands/device/get-device";
import { Connection } from "./connection";
import { formatData } from "./util/data";

/** Represents an iConnectivity device with a MIDI input and output */
export class Device extends Connection {
  private supportedCommands: Set<Command>;

  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput,
    public readonly info: DeviceInfo,

    supportedCommands: Command[]
  ) {
    super(input, output);
    this.supportedCommands = new Set(supportedCommands);
  }

  get serialNumber() {
    return formatData(this.info.serialNumber);
  }

  supportsCommand(command: Command) {
    if (
      command === DeviceCommand.GetDevice ||
      command === DeviceCommand.GetCommandList
    ) {
      return true;
    }

    return this.supportedCommands.has(command);
  }

  getSupportedCommandNames() {
    return [...this.supportedCommands.values()].map((c) => getCommandName(c));
  }
}
