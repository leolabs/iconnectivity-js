import { DataBlock, DataBlockType } from ".";
import { Command } from "../commands";
import { Data, parseBlocksFromData } from "../util";

export interface CommandDefinition {
  id: Command;
  data: Data;
}

export const parameterValueToBytes = (value: CommandDefinition) => {
  return [value.data.length + 2, value.id, ...value.data];
};

export const bytesToParameterValue = (bytes: Data) => {
  return { id: bytes[1], data: bytes.slice(2) };
};

/**
 * This data block is used to define which
 * command IDs and command values a device supports.
 */
export class CmdDef extends DataBlock {
  type = DataBlockType.CmdDef;

  constructor(public definitions: CommandDefinition[]) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const values = parseBlocksFromData(bytes, bytesToParameterValue);
    return new CmdDef(values);
  }

  getInternalData() {
    return [
      this.definitions.length,
      ...this.definitions.flatMap(parameterValueToBytes),
    ];
  }
}
