import { DataBlock, DataBlockType } from ".";
import { DataClassMap } from "../data-classes";
import { Data } from "../util";

/**
 * This data block is used to hold a list of parameters
 * to be retrieved from a device for a specific data class.
 */
export class ParmList<T extends keyof DataClassMap> extends DataBlock {
  type = DataBlockType.ParmList;

  constructor(public parameters: Array<DataClassMap[T]>) {
    super();
  }

  static fromData(data: Data) {
    return new ParmList([...data.slice(3)]);
  }

  getInternalData() {
    return [this.parameters.length, ...this.parameters];
  }
}
