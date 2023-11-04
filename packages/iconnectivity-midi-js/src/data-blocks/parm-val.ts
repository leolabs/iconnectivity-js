import { DataBlock, DataBlockType } from ".";
import { Data } from "../util";

export interface ParameterValue {
  id: number;
  data: Data;
}

export const parameterValueToBytes = (value: ParameterValue) => {
  return [value.data.length + 2, value.id, ...value.data];
};

export const bytesToParameterValue = (bytes: Data) => {
  return { id: bytes[1], data: bytes.slice(2) };
};

/**
 * This data block is used to hold a list of parameters
 * to be retrieved from a device for a specific data class.
 */
export class ParmVal extends DataBlock {
  type = DataBlockType.ParmVal;

  constructor(public values: ParameterValue[]) {
    super();
  }

  static fromData(data: Data) {
    const values: ParameterValue[] = [];
    const bytes = data.slice(3);
    let pointer = 0;

    while (pointer < bytes.length) {
      const size = bytes[pointer];
      const param = bytes.slice(pointer, pointer + size);
      values.push(bytesToParameterValue(param));
      pointer += size;
    }

    return new ParmVal(values);
  }

  getInternalData() {
    return [this.values.length, ...this.values.flatMap(parameterValueToBytes)];
  }
}
