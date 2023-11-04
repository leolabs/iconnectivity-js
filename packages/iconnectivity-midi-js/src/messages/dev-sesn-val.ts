import { Message, MessageClass } from ".";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType } from "../data-classes";
import { Data, parseBlocksFromData } from "../util";

/**
 * DevSesnVal messages are sent from a device to a host in response
 * to an HstSesnVal message (exchange session information).
 */
export class DevSesnVal extends Message {
  type = MessageClass.DevSesnVal;
  dataClass = DataClassType.SessionInfo;

  constructor(public parmVals: ParmVal[]) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, ParmVal.fromData);
    return new DevSesnVal(blocks);
  }

  getInternalData(): Data {
    return [this.parmVals.length, ...this.parmVals.flatMap((v) => v.toData())];
  }
}
