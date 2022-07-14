import { Command, getCommandName } from "./commands";
import { DeviceCommand, DeviceInfoType } from "./commands/device";
import { DeviceInfo } from "./commands/device/get-device";
import { getInfo } from "./commands/device/get-info";
import { getInfoList } from "./commands/device/get-info-list";
import { Connection } from "./connection";
import { formatData } from "./util/data";

/** Represents an iConnectivity device with a MIDI input and output */
export class Device extends Connection {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput,
    public readonly info: DeviceInfo,
    public readonly supportedCommands: Command[]
  ) {
    super(input, output);
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

    return this.supportedCommands.includes(command);
  }

  getSupportedCommandNames() {
    return this.supportedCommands.map((c) => getCommandName(c));
  }

  async getAllInfo() {
    const supportedInfo = await getInfoList({ device: this });

    if (!supportedInfo) {
      return null;
    }

    const info = await Promise.all(
      supportedInfo.map(async (infoType) => ({
        infoType,
        info: await getInfo({ device: this, infoType }),
      }))
    );

    return info.reduce((acc, cur) => {
      if (cur.info) {
        acc[cur.infoType] = cur.info;
      }

      return acc;
    }, {} as Record<DeviceInfoType, string>);
  }
}
