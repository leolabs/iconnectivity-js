import { Message, MessageClass } from ".";
import { Data, parseBlocksFromData } from "../util";
import { DataBlockType } from "../data-blocks";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType } from "../data-classes";
import { OneOrMore, assertOneOrMore, isTruthy } from "../util/array";

/**
 * NotParmVal messages are sent from a device to a host when parameters are changed on a device
 * that the host did not initiate, but only if the host has registered for automatic updates using
 * the Notification command.
 */
export class NotParmVal extends Message {
  type = MessageClass.NotParmVal;

  constructor(
    public dataClass: DataClassType,
    public argVal: ArgVal | null,
    public parmVals: OneOrMore<ParmVal>
  ) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, (d) => d);

    const argVal = blocks.find((b) => b[1] === DataBlockType.ArgVal);
    const parmVals = blocks.filter((b) => b[1] === DataBlockType.ParmVal);

    const mappedVals = parmVals.map(ParmVal.fromData);
    assertOneOrMore(mappedVals, "No ParmVal blocks found");

    return new NotParmVal(
      data[1],
      argVal ? ArgVal.fromData(argVal) : null,
      mappedVals
    );
  }

  getInternalData(): Data {
    const blocks = [this.argVal, ...(this.parmVals ?? [])].filter(isTruthy);
    return [blocks.length, ...blocks.flatMap((b) => b.toData())];
  }
}
