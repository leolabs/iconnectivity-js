import { Message, MessageClass } from ".";
import { CmdVal } from "../data-blocks/cmd-val";
import { DataClassType } from "../data-classes";
import { Data } from "../util";

/**
 * SetCmdVal messages are sent from a host to a device to execute a command.
 * The device will return an Ack message.
 */
export class SetCmdVal extends Message {
  type = MessageClass.SetCmdVal;
  dataClass = DataClassType.Null;

  constructor(public cmdVals: CmdVal[]) {
    super();
  }

  getInternalData(): Data {
    return [this.cmdVals.length, ...this.cmdVals.flatMap((v) => v.toData())];
  }
}
