import { MessageClass } from "./messages";
import { Connectable } from "./connection";
import {
  BodyParameters,
  Data,
  MAX_NUMBER,
  buildBody,
  buildMessage,
  formatData,
  random7bit,
} from "./util";
import { ErrorCode } from "./messages/ack";

export interface SendCommandOptions
  extends Omit<BodyParameters, "transactionId" | "sessionId"> {
  device: Connectable;
  debug?: boolean;
}

export type MessageOptions = Omit<SendCommandOptions, "message">;

/** Returns a command name based on the given command code. */
export const getMessageName = (message: MessageClass) =>
  MessageClass[message] ?? `Unknown message 0x${message.toString(16)}`;

/** A random session ID */
const sessionId = [
  random7bit(),
  random7bit(),
  random7bit(),
  random7bit(),
] as const;

/** The current transaction ID, increases with every sent command. */
let transactionId = 0;

/**
 * Increases the transaction ID by 1 and returns it.
 * If the transaction ID is greater than MAX_NUMBER, it wraps around to 0.
 */
const getNextTransactionId = () => {
  transactionId = (transactionId + 1) % MAX_NUMBER;
  return transactionId;
};

/**
 * Sends a message to the given output and waits for a response
 * from the input. This function builds a MIDI message based on
 * the parameters, automatically adding required headers, a
 * transaction ID, and a checksum.
 */
export const sendMessage = async ({
  device,
  message,
  productId,
  serialNumber,
  debug,
}: SendCommandOptions) => {
  const body = buildBody({
    message,
    productId,
    serialNumber: serialNumber ?? device.serialNumber,
    transactionId: getNextTransactionId(),
    sessionId,
  });

  const compiled = buildMessage(body);

  const result = await device.sendMessage(compiled, {
    messageClass: message.type,
    debug,
    transactionId,
  });

  if (result[22] === MessageClass.Ack) {
    const code = result[26] as ErrorCode;

    if (code !== ErrorCode.NoError) {
      throw new Error(
        `Command failed with error code ${formatData([code])} (${
          ErrorCode[code]
        })`
      );
    }
  }

  return result;
};

/** Returns the part of the response that contains the data */
export const getResponseBody = (response: Data) => {
  return response.slice(21, response.length - 2);
};
