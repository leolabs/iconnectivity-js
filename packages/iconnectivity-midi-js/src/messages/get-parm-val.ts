import { Message, MessageClass } from ".";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmList } from "../data-blocks/parm-list";
import { DataClassType } from "../data-classes";
import { Data } from "../util";
import { isTruthy } from "../util/array";

/**
 * GetParmVal messages are sent from a host to a device to retrieve parameter values from a device.
 * The device will return either a RetParmVal message or an Ack message with an error code.
 */
export class GetParmVal extends Message {
  type = MessageClass.GetParmVal;

  constructor(
    public dataClass: DataClassType,
    public argVal?: ArgVal,
    public parmLists?: ParmList[]
  ) {
    super();
  }

  getInternalData(): Data {
    const blocks = [this.argVal, ...(this.parmLists ?? [])].filter(isTruthy);
    return [blocks.length, ...blocks.flatMap((b) => b.toData())];
  }
}
