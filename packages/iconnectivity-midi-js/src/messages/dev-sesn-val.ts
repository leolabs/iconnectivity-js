import { Message, MessageClass } from ".";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassMap, DataClassType } from "../data-classes";
import { Data, parseBlocksFromData } from "../util";

/**
 * DevSesnVal messages are sent from a device to a host in response
 * to an HstSesnVal message (exchange session information).
 */
export class DevSesnVal<T extends keyof DataClassMap> extends Message {
  type = MessageClass.DevSesnVal;
  dataClass = DataClassType.SessionInfo;

  constructor(public parmVals: ParmVal<T>[]) {
    super();
  }

  static fromData<T extends keyof DataClassMap>(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, ParmVal.fromData) as ParmVal<T>[];
    return new DevSesnVal<T>(blocks);
  }

  getInternalData(): Data {
    return [this.parmVals.length, ...this.parmVals.flatMap((v) => v.toData())];
  }
}
