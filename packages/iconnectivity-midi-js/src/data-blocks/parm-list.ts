import { DataBlock, DataBlockType } from ".";
import { Data } from "../util";

export type Parameter = number;

/**
 * This data block is used to hold a list of parameters
 * to be retrieved from a device for a specific data class.
 */
export class ParmList extends DataBlock {
  type = DataBlockType.ParmList;

  constructor(public parameters: Parameter[]) {
    super();
  }

  static fromData(data: Data) {
    return new ParmList([...data.slice(3)]);
  }

  getInternalData() {
    return [this.parameters.length, ...this.parameters];
  }
}
