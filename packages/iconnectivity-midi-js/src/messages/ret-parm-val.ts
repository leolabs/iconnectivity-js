import { Message, MessageClass } from ".";
import { Data, parseBlocksFromData } from "../util";
import { DataBlockType } from "../data-blocks";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType } from "../data-classes";
import { OneOrMore, assertOneOrMore, isTruthy } from "../util/array";

/**
 * RetParmVal messages are sent from a device to a host in response
 * to a GetParmVal message (return parameter values from a device).
 */
export class RetParmVal extends Message {
  type = MessageClass.RetParmVal;

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

    return new RetParmVal(
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
