import { AudioCommand, CommandOptions, getResponseBody, sendCommand } from "..";
import { makeBitmap } from "../../util/bitmap";
import { mergeNumber, splitNumber } from "../../util/number";

export interface GetAudioPortMeterValueOptions extends CommandOptions {
  portId: number;
  fetchOutputs?: boolean;
  fetchInputs?: boolean;
}

export interface AudioPortMeterValue {
  portId: number;
  outputs: MeterValue[];
  inputs: MeterValue[];
}

export interface MeterValue {
  channel: number;
  valueRaw: number;
  valueDb: number;
}

/**
 * This command is used to query a device for the most
 * recent meter values for a specific audio port.
 */
export const getAudioPortMeterValue = async ({
  portId,
  fetchOutputs,
  fetchInputs,
  ...params
}: GetAudioPortMeterValueOptions): Promise<AudioPortMeterValue> => {
  const response = await sendCommand({
    ...params,
    command: AudioCommand.GetAudioPortMeterValue,
    data: [...splitNumber(portId), makeBitmap(fetchOutputs, fetchInputs)],
  });

  const body = getResponseBody(response);
  const blockCount = body[3];

  const inputs: MeterValue[] = [];
  const outputs: MeterValue[] = [];

  let pointer = 4;

  for (let i = 0; i < blockCount; i++) {
    const type = body[pointer];
    const numberOfChannels = body[pointer + 1];
    const dest = type === 1 ? inputs : outputs;
    pointer += 2;

    for (let j = 0; j < numberOfChannels; j++) {
      const valueRaw = mergeNumber(body.slice(pointer, pointer + 2));
      const valueDb = 20 * Math.log(valueRaw / 8192);
      dest.push({ channel: j + 1, valueRaw, valueDb });
      pointer += 2;
    }
  }

  return {
    portId: mergeNumber(body.slice(1, 3)),
    inputs,
    outputs,
  };
};
