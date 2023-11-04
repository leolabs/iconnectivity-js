import { Message, MessageClass } from ".";
import { DataClassType } from "../data-classes";
import { Data } from "../util";

/**
 * GetCmdDef messages are sent from a host to a device to retrieve a list of executable commands that the
 * device supports. The device will return either a RetCmdDef message or an Ack message with an error code.
 */
export class GetCmdDef extends Message {
  type = MessageClass.GetCmdDef;
  dataClass = DataClassType.Null;

  constructor() {
    super();
  }

  getInternalData(): Data {
    return [];
  }
}
