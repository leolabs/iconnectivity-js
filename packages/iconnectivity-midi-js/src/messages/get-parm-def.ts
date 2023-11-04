import { Message, MessageClass } from ".";
import { DataClassType } from "../data-classes";
import { Data } from "../util";

/**
 * GetParmDef messages are sent from a host to a device to retrieve a list of parameter definitions from a
 * device for a specific data class. The device will return either a RetParmDef message or an Ack message
 * with an error code.
 */
export class GetParmDef extends Message {
  type = MessageClass.GetParmDef;

  constructor(public dataClass: DataClassType) {
    super();
  }

  getInternalData(): Data {
    return [];
  }
}
