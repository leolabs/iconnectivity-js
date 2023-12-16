import { Message, MessageClass } from ".";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmVal } from "../data-blocks/parm-val";
import { DataClassMap } from "../data-classes";
import { Data } from "../util";
import { isTruthy } from "../util/array";
import { Ack } from "./ack";
import { MessageOptions, getResponseBody, sendMessage } from "../send-message";

/**
 * SetParmVal messages are sent from a host to a device to set parameter values in a device.
 * The device will return an Ack message.
 */
export class SetParmVal<T extends keyof DataClassMap> extends Message {
  type = MessageClass.SetParmVal;

  constructor(
    public dataClass: T,
    public argVal?: ArgVal,
    public parmVals?: ParmVal<T>[]
  ) {
    super();
  }

  getInternalData(): Data {
    const blocks = [this.argVal, ...(this.parmVals ?? [])].filter(isTruthy);
    return [blocks.length, ...blocks.flatMap((b) => b.toData())];
  }
}

/**
 * Helper function to set data on the device. Sends a {@link SetParmVal}
 * message and parses the response body as a {@link Ack} object.
 */
export const setParmVal = async <T extends keyof DataClassMap, V = ParmVal<T>>({
  dataType,
  parmVal,
  argVal,
  ...params
}: MessageOptions & {
  dataType: T;
  parmVal: V;
  argVal?: ArgVal;
}) => {
  const res = await sendMessage({
    ...params,
    debug: true,
    message: new SetParmVal(dataType, argVal, [parmVal as any]),
  });

  const body = getResponseBody(res);
  console.log({ body });
  return Ack.fromData(body);
};
