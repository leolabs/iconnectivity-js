import { Message, MessageClass } from ".";
import { ArgVal } from "../data-blocks/arg-val";
import { ParmList } from "../data-blocks/parm-list";
import { DataClassMap } from "../data-classes";
import { Data } from "../util";
import { isTruthy } from "../util/array";
import { RetParmVal } from "./ret-parm-val";
import { MessageOptions, getResponseBody, sendMessage } from "../send-message";

/**
 * GetParmVal messages are sent from a host to a device to retrieve parameter values from a device.
 * The device will return either a RetParmVal message or an Ack message with an error code.
 */
export class GetParmVal<T extends keyof DataClassMap> extends Message {
  type = MessageClass.GetParmVal;

  constructor(
    public dataClass: T,
    public argVal?: ArgVal,
    public parmLists?: ParmList<T>[]
  ) {
    super();
  }

  getInternalData(): Data {
    const blocks = [this.argVal, ...(this.parmLists ?? [])].filter(isTruthy);
    return [blocks.length, ...blocks.flatMap((b) => b.toData())];
  }
}

/**
 * Helper function to fetch data from the device. Sends a {@link GetParmVal}
 * message and parses the response body as a {@link RetParmVal} object.
 */
export const getParmVal = async <
  T extends keyof DataClassMap,
  L = ParmList<T>
>({
  dataType,
  parmList,
  argVal,
  ...params
}: MessageOptions & {
  dataType: T;
  parmList: L;
  argVal?: ArgVal;
}) => {
  const portValues = await sendMessage({
    ...params,
    message: new GetParmVal(dataType, argVal, [parmList as any]),
  });

  const body = getResponseBody(portValues);
  return RetParmVal.fromData<T>(body);
};
