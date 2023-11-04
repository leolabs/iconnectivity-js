import { Message, MessageClass } from ".";
import { CmdDef } from "../data-blocks/cmd-def";
import { DataClassType } from "../data-classes";
import { Data, parseBlocksFromData } from "../util";

/**
 * RetCmdDef messages are sent from a device to a host in response to a GetCmdDef message
 * (returns a list of command IDs and command values that the device supports).
 */
export class RetCmdDef extends Message {
  type = MessageClass.RetCmdDef;
  dataClass = DataClassType.Null;

  constructor(public cmdDefs: CmdDef[]) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, CmdDef.fromData);
    return new RetCmdDef(blocks);
  }

  getInternalData(): Data {
    return [this.cmdDefs.length, ...this.cmdDefs.flatMap((v) => v.toData())];
  }
}
