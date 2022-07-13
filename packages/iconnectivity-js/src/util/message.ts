import { Command } from "../commands";
import { Product } from "../types/product";
import { buildCommandCode, CommandType } from "./command-code";
import { Data } from "./data";
import { splitNumber } from "./number";

// From the manual:
//
// Header:
// 0xF0 - start of system exclusive
// 0x00, 0x01, 0x73 0x7E - iConnectivity's manufacturer ID code - message class
//
// Body:
// Device ID - 7 bytes (2 bytes for product ID, 5 bytes for serial number)
// Transaction ID - 2 bytes (0 - 16383)
// Command - 2 bytes
// Data Length - 2 bytes, number of bytes in Command Data (0 - 16383)
// Command Data - length varies depending on command
// Checksum - 1 byte
//
// Footer:
// 0xF7 - end of system exclusive

/** The header that is sent with every SysEx message. */
export const MESSAGE_HEADER = [0xf0, 0x00, 0x01, 0x73, 0x7e];

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
  command: Command;
  productId?: Product | Data;
  serialNumber?: Data;
  transactionId?: number;
  data?: Data;
}

/** Builds the message body from the given parameters. */
export const buildBody = ({
  command,
  productId,
  serialNumber,
  transactionId,
  data,
}: BodyParameters) => {
  if (typeof productId === "number") {
    productId = splitNumber(productId);
  }

  return [
    ...(productId ?? [0, 0]), // product ID, if set
    ...(serialNumber ?? [0, 0, 0, 0, 0]), // serial number, if set
    ...splitNumber(transactionId ?? 0), // transaction ID
    ...buildCommandCode(CommandType.Query, command), // flags and command
    ...splitNumber(data?.length ?? 0), // data length, max 16383
    ...(data ?? []), // command data
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
