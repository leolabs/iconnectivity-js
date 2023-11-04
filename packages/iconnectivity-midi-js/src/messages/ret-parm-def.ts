import { Message, MessageClass } from ".";
import { ParmDef } from "../data-blocks/parm-def";
import { DataClassType } from "../data-classes";
import { Data, parseBlocksFromData } from "../util";

/**
 * RetParmDef messages are sent from a device to a host in response
 * to a GetParmDef message (returns a list of parameters from a device).
 */
export class RetParmDef extends Message {
  type = MessageClass.RetParmDef;

  constructor(public dataClass: DataClassType, public parmDefs: ParmDef[]) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, ParmDef.fromData);
    return new RetParmDef(data[1], blocks);
  }

  getInternalData(): Data {
    return [this.parmDefs.length, ...this.parmDefs.flatMap((v) => v.toData())];
  }
}
