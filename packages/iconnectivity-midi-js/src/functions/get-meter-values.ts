import { ArgVal, ArgValId } from "../data-blocks/arg-val";
import { ParmList } from "../data-blocks/parm-list";
import { AudioPortInfo, DataClassType } from "../data-classes";
import { getParmVal } from "../messages/get-parm-val";
import { MessageOptions } from "../send-message";
import { mergeNumber } from "../util";

export interface AudioPortMeterValue {
  portId: number;
  outputs: MeterValue[];
}

export interface MeterValue {
  channel: number;
  valueRaw: number;
  valueDb: number;
}

export type MeterValueParams = MessageOptions & { portId: number };

/**
 * Returns a list of all meter values for the given port.
 */
export const getMeterValues = async ({
  portId,
  ...params
}: MeterValueParams): Promise<AudioPortMeterValue> => {
  const res = await getParmVal({
    ...params,
    dataType: DataClassType.AudioPortInfo,
    parmList: new ParmList([AudioPortInfo.PortMeterSRC]),
    argVal: new ArgVal([{ id: ArgValId.AudioPortId, value: portId }]),
  });

  const outputs: MeterValue[] = [];
  const values = res.parmVals[0].values[0].data;

  for (let i = 0; i < values.length; i += 2) {
    const valueRaw = mergeNumber([values[i], values[i + 1]]);
    const valueDb = 20 * Math.log(valueRaw / 8192);
    outputs.push({ channel: i / 2 + 1, valueRaw, valueDb });
  }

  return { portId, outputs };
};
