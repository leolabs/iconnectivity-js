import { DataBlock, DataBlockType } from ".";
import { Command } from "../commands";
import { Data } from "../util";

export interface CommandValue {
  id: Command;
  value: number;
  args?: Data;
}

export const commandValueToBytes = (value: CommandValue) => {
  return [
    (value.args?.length ?? 0) + 3,
    value.id,
    value.value,
    ...(value.args ?? []),
  ];
};

export const bytesToCommandValue = (bytes: Data) => {
  return { id: bytes[1], value: bytes[2], args: bytes.slice(3) };
};

/**
 * This data block is sent from a
 * host to a device to execute commands.
 */
export class CmdVal extends DataBlock {
  type = DataBlockType.CmdVal;

  constructor(public values: CommandValue[]) {
    super();
  }

  static fromData(data: Data) {
    const values: CommandValue[] = [];
    const bytes = data.slice(3);
    let pointer = 0;

    while (pointer < bytes.length) {
      const size = bytes[pointer];
      const param = bytes.slice(pointer, pointer + size);
      values.push(bytesToCommandValue(param));
      pointer += size;
    }

    return new CmdVal(values);
  }

  getInternalData() {
    return [this.values.length, ...this.values.flatMap(commandValueToBytes)];
  }
}
