import { DataBlock, DataBlockType } from ".";
import { DataClassMap } from "../data-classes";
import { Data } from "../util";

export interface ParameterValue<T extends keyof DataClassMap> {
  id: DataClassMap[T];
  data: Data;
}

export const parameterValueToBytes = <T extends keyof DataClassMap>(
  value: ParameterValue<T>
) => {
  return [value.data.length + 2, value.id, ...value.data];
};

export const bytesToParameterValue = (bytes: Data) => {
  return { id: bytes[1], data: bytes.slice(2) };
};

/**
 * This data block is used to hold a list of parameters
 * to be retrieved from a device for a specific data class.
 */
export class ParmVal<T extends keyof DataClassMap> extends DataBlock {
  type = DataBlockType.ParmVal;

  constructor(public values: ParameterValue<T>[]) {
    super();
  }

  static fromData<T extends keyof DataClassMap>(data: Data) {
    const values: ParameterValue<T>[] = [];
    const bytes = data.slice(3);
    let pointer = 0;

    while (pointer < bytes.length) {
      const size = bytes[pointer];
      const param = bytes.slice(pointer, pointer + size);
      values.push(bytesToParameterValue(param) as any);
      pointer += size;
    }

    return new ParmVal<T>(values);
  }

  getInternalData() {
    return [this.values.length, ...this.values.flatMap(parameterValueToBytes)];
  }
}
