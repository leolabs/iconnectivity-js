import { Connectable } from "../connection";
import { MessageClass } from "../messages";
import { Data, formatData } from "../util/data";
import { BodyParameters, buildBody, buildMessage } from "../util/message";
import { MAX_NUMBER } from "../util/number";

import { ErrorCode } from "../messages/ack";

export enum Command {
  /** Used to change a device’s operating mode. */
  DeviceMode = 0x01,
  /** Used to manage globals and presets between RAM and non-volatile storage. */
  SaveLoad = 0x02,
  /** Used to set a group of parameters to a predefined state. */
  SetGroup = 0x03,
  /** Used to start a bulk data transfer operation. */
  BulkRequest = 0x04,
  /** Used to register for automatic parameter updates. */
  Notification = 0x05,
  /** Used to trigger MIDI operations, functions, and events. */
  MidiOperation = 0x06,
}

export interface SendCommandOptions extends BodyParameters {
  device: Connectable;
  debug?: boolean;
}

export type CommandOptions = Omit<SendCommandOptions, "command" | "data">;

/** Returns a command name based on the given command code. */
export const getCommandName = (command: Command) =>
  Command[command] ?? `Unknown command 0x${command.toString(16)}`;

/**
 * Support for some commands isn't returned by the GetCommandList command,
 * but is instead inferred by the support for another command. This map
 * keeps track of this.
 */
export const COMMAND_MAP = new Map<Command, Command>([]);

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
 * Sends a command to the given output and waits for a response
 * from the input. This function builds a MIDI message based on
 * the parameters, automatically adding required headers, a
 * transaction ID, and a checksum.
 */
export const sendCommand = async ({
  device,
  command,
  productId,
  serialNumber,
  transactionId = getNextTransactionId(),
  data,
  debug,
}: SendCommandOptions) => {
  const body = buildBody({
    command,
    data,
    productId,
    serialNumber: serialNumber ?? device.serialNumber,
    transactionId,
  });

  const message = buildMessage(body);

  const result = await device.sendMessage(message, {
    command,
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
  return response.slice(26, response.length - 2);
};
