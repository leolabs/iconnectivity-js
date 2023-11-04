import { Data } from "../util";

export enum DataBlockType {
  /** Parameter List: Used to hold a list of parameter IDs to be retrieved from a device for a specific data class. */
  ParmList = 0x01,
  /** Parameter Definition: Used to define which parameters are supported by a device for a specific data class along with their attributes. */
  ParmDef = 0x02,
  /** Parameter Value: Used to define parameter values when reading from a device or writing to a device for a specific data class. */
  ParmVal = 0x03,
  /** Argument Value: Used to define argument values when reading parameters from a device or writing parameters to a device. */
  ArgVal = 0x04,
  /** Command Definition: Used to define which commands and command values a device supports. */
  CmdDef = 0x05,
  /** Command Value: Used to execute commands in a device. */
  CmdVal = 0x06,
  /** Bulk Header: Used for backup and restore operations. */
  BulkHdr = 0x07,
}

export abstract class DataBlock {
  abstract type: DataBlockType;
  abstract getInternalData(): Data;

  /** Returns the entire data block as bytes */
  toData() {
    const data = this.getInternalData();
    return [data.length + 2, this.type, ...data];
  }
}
