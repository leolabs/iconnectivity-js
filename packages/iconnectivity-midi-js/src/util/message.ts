import { Message } from "../messages";
import { Product } from "../types/product";
import { Data } from "./data";
import { splitNumber } from "./number";

// From the manual:
//
// Header:
// 0xF0 - start of system exclusive
// 0x00, 0x01, 0x73 - iConnectivity's manufacturer ID code
// 0x7D - message class
//
// Body:
// Device ID - 7 bytes (2 bytes for product ID, 5 bytes for serial number)
// Session ID - 4 bytes (28 bit value)
// Transaction ID - 4 bytes (28 bit value)
// Message Length - 2 bytes, number of bytes in message content (14 bit value)
// Message Content - variable length depending on message
// Checksum - 1 byte
//
// Footer:
// 0xF7 - 1 byte, end of system exclusive

/** The header that is sent with every SysEx message. */
export const MESSAGE_HEADER = [0xf0, 0x00, 0x01, 0x73, 0x7d];

/**
 * Builds the checksum of a given body.
 *
 * From the docs:
 * This field contains the 2s complement of the sum of all bytes in the body,
 * excluding the checksum byte. In other words, summing all the bytes in the
 * body should result in 0x00. Note that the checksum byte must be 0x7F or
 * less to be compatible with MIDI sysex format (i.e. if the calculated checksum
 * value is 0x83 then the checksum value used in the sysex message should be 0x03).
 */
const buildChecksum = (sum: number) => ((~sum + 1) >>> 0) % 128;

export interface BodyParameters {
  message: Message;
  productId?: Product | Data;
  serialNumber?: Data;
  sessionId?: readonly [number, number, number, number];
  transactionId: number;
}

/** Builds the message body from the given parameters. */
export const buildBody = ({
  message,
  productId,
  serialNumber,
  sessionId,
  transactionId,
}: BodyParameters) => {
  if (typeof productId === "number") {
    productId = splitNumber(productId);
  }

  const msgData = message.toData();

  return [
    ...(productId ?? [0, 0]), // product ID, if set
    ...(serialNumber ?? [0, 0, 0, 0, 0]), // serial number, if set
    ...(sessionId ?? [0, 0, 0, 0]), // session ID, if set
    ...[0, 0], // transaction ID padding
    ...splitNumber(transactionId), // transaction ID
    ...splitNumber(msgData.length), // message length
    ...msgData, // message data
  ];
};

/** Builds a message based on the given body that conforms to iConnectivity's spec. */
export const buildMessage = (body: Data) => {
  const output = [...MESSAGE_HEADER, ...body];
  const bodySum = [...body].reduce((acc, cur) => (acc += cur));
  output.push(buildChecksum(bodySum), 0xf7);
  return output;
};

/** Validates an incoming message. */
export const isValidMessage = (input: Data) => {
  const sum = [...input].slice(5, -1).reduce((acc, cur) => (acc += cur), 0);
  return buildChecksum(sum) === 0;
};
