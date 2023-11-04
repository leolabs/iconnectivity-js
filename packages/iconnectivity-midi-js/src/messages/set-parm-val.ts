import { Message, MessageClass } from ".";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType } from "../data-classes";
import { Data } from "../util";
import { isTruthy } from "../util/array";

/**
 * SetParmVal messages are sent from a host to a device to set parameter values in a device.
 * The device will return an Ack message.
 */
export class SetParmVal extends Message {
  type = MessageClass.SetParmVal;

  constructor(
    public dataClass: DataClassType,
    public argVal?: ArgVal,
    public parmVals?: ParmVal[]
  ) {
    super();
  }

  getInternalData(): Data {
    const blocks = [this.argVal, ...(this.parmVals ?? [])].filter(isTruthy);
    return [blocks.length, ...blocks.flatMap((b) => b.toData())];
  }
}
