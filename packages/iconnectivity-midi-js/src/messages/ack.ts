import { Message, MessageClass } from ".";
import { DataClassType } from "../data-classes";
import { Data } from "../util";

export enum ErrorCode {
  /** No error. */
  NoError = 0x00,
  /** Malformed message, message failed to parse correctly, bad length, bad checksum. */
  MalformedMessage = 0x01,
  /** Message class not supported. */
  MessageClassNotSupported = 0x02,
  /** Data class not supported. */
  DataClassNotSupported = 0x03,
  /** Message in too large, message cannot be received because it is too large. */
  MessageInTooLarge = 0x04,
  /** Message out too large, message cannot be sent because it is too large. */
  MessageOutTooLarge = 0x05,
  /** Data block length is invalid. */
  DataBlockLengthInvalid = 0x06,
  /** Data block type is invalid. */
  DataBlockTypeInvalid = 0x07,
  /** Argument ID is invalid. */
  ArgumentIdInvalid = 0x08,
  /** Argument value is invalid. */
  ArgumentValueInvalid = 0x09,
  /** Parameter ID is invalid. */
  ParameterIdInvalid = 0x0a,
  /** Parameter value is invalid. */
  ParameterValueInvalid = 0x0b,
  /** Invalid characters used for name. */
  NameCharactersInvalid = 0x0c,
  /** Command ID is invalid. */
  CommandIdInvalid = 0x0d,
  /** Command value is invalid. */
  CommandValueInvalid = 0x0e,
  /** Command argument is invalid. */
  CommandArgumentInvalid = 0x0f,
  /** Required ArgVal block was not found or does not occur before other data blocks. */
  ArgValNotFound = 0x10,
  /** Sub ID is invalid. */
  SubIdInvalid = 0x11,
  /** Sub ID value is invalid. */
  SubIdValueInvalid = 0x12,
  /** Command failed. */
  CommandFailed = 0x13,
}

/**
 * Ack messages are sent from a device to a host in response to
 * various messages sent from the host (returns success or failure).
 */
export class Ack extends Message {
  type = MessageClass.Ack;
  dataClass = DataClassType.Null;

  constructor(
    public hostMessageClass: MessageClass,
    public hostDataClass: DataClassType,
    public errorCode: ErrorCode
  ) {
    super();
  }

  static fromData(data: Data) {
    const bytes = data.slice(3);

    if (bytes.length !== 3) {
      throw new Error(
        "Ack message needs to be 3 bytes long, but is " +
          bytes.length +
          " bytes long"
      );
    }

    return new Ack(bytes[0], bytes[1], bytes[2]);
  }

  getInternalData(): Data {
    return [this.hostMessageClass, this.hostDataClass, this.errorCode];
  }
}
