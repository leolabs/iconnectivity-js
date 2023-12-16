import { Message, MessageClass } from ".";
import { Data, parseBlocksFromData } from "../util";
import { DataBlock } from "../data-blocks";
import { DataClassType } from "../data-classes";
import { OneOrMore, assertOneOrMore } from "../util/array";
import { parseDataBlock } from "../data-blocks/parse-data-block";

/**
 * BulkTransfer messages are sent between a device and a host (or another device)
 * to perform bulk data transfer operations (i.e. backup and restore).
 */
export class BulkTransfer extends Message {
  type = MessageClass.BulkTransfer;
  dataClass = DataClassType.BulkData;

  constructor(public dataBlocks: OneOrMore<DataBlock>) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);
    const blocks = parseBlocksFromData(bytes, parseDataBlock);
    assertOneOrMore(blocks, "No data blocks found");
    return new BulkTransfer(blocks);
  }

  getInternalData(): Data {
    return [
      this.dataBlocks.length,
      ...this.dataBlocks.flatMap((b) => b.toData()),
    ];
  }
}
