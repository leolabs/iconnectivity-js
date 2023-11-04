import { Message, MessageClass } from ".";
import { DataBlock } from "../data-blocks";
import { DataClassType } from "../data-classes";
import { Data } from "../util";

/**
 * HstSesnVal messages are sent from a host to a device to exchange session information.
 * The device will return either a DevSesnVal message or an Ack message with an error code.
 */
export class HstSesnVal extends Message {
  type = MessageClass.HstSesnVal;
  dataClass = DataClassType.SessionInfo;

  constructor(public dataBlocks: DataBlock[]) {
    super();
  }

  getInternalData(): Data {
    return [
      this.dataBlocks.length,
      ...this.dataBlocks.flatMap((d) => d.toData()),
    ];
  }
}
