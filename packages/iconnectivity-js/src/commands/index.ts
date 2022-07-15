import { Connectable } from "../connection";
import { Data, formatData } from "../util/data";
import { BodyParameters, buildBody, buildMessage } from "../util/message";
import { MAX_NUMBER } from "../util/number";

import { AdvancedMidiProcessorCommand } from "./advanced-midi-processor";
import { AudioCommand } from "./audio";
import { AudioMixerCommand } from "./audio-mixer";
import { AutomationControlCommand } from "./automation-control";
import { DeviceCommand, ErrorCode } from "./device";
import { HardwareInterfaceCommand } from "./hardware-interface";
import { MidiCommand } from "./midi";
import { SnapshotCommand } from "./snapshot";

export * from "./advanced-midi-processor";
export * from "./audio";
export * from "./audio-mixer";
export * from "./automation-control";
export * from "./device";
export * from "./hardware-interface";
export * from "./midi";
export * from "./snapshot";

/** Represents the command ID that is sent to or from a device. */
export type Command =
  | DeviceCommand
  | MidiCommand
  | AudioCommand
  | AudioMixerCommand
  | AutomationControlCommand
  | AdvancedMidiProcessorCommand
  | SnapshotCommand
  | HardwareInterfaceCommand;

export interface SendCommandOptions extends BodyParameters {
  device: Connectable;
  debug?: boolean;
}

export type CommandOptions = Omit<SendCommandOptions, "command" | "data">;

/** Returns a command name based on the given command code. */
export const getCommandName = (command: Command) =>
  DeviceCommand[command] ??
  MidiCommand[command] ??
  AudioCommand[command] ??
  AudioMixerCommand[command] ??
  AutomationControlCommand[command] ??
  AdvancedMidiProcessorCommand[command] ??
  SnapshotCommand[command] ??
  HardwareInterfaceCommand[command] ??
  `Unknown command 0x${command.toString(16)}`;

/**
 * Support for some commands isn't returned by the GetCommandList command,
 * but is instead inferred by the support for another command. This map
 * keeps track of this.
 */
export const COMMAND_MAP = new Map<Command, Command>([
  [SnapshotCommand.ApplySnapshot, SnapshotCommand.GetSnapshotParm],
  [SnapshotCommand.CreateSnapshot, SnapshotCommand.GetSnapshotParm],
  [SnapshotCommand.ApplySnapshotList, SnapshotCommand.GetSnapshotList],
]);

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

/** Sends a message to the given output and waits for a response. */
export const sendCommand = async ({
  device,
  command,
  productId,
  serialNumber,
  transactionId = getNextTransactionId(),
  data,
  debug,
}: SendCommandOptions) => {
  if (
    device.supportsCommand &&
    !device.supportsCommand(COMMAND_MAP.get(command) ?? command)
  ) {
    throw new Error(
      `Device does not support command ${getCommandName(command)}`
    );
  }

  const body = buildBody({
    command,
    data,
    productId,
    serialNumber: serialNumber ?? device.serialNumber,
    transactionId,
  });

  const message = buildMessage(body);

  try {
    const result = await device.sendMessage(message, { command, debug });

    if (result[15] === DeviceCommand.ACK) {
      const code = result[20] as ErrorCode;

      if (code !== ErrorCode.NoError) {
        throw new Error(
          `Command failed with error code ${formatData([code])} (${
            ErrorCode[code]
          })`
        );
      }
    }

    return result;
  } catch (e) {
    console.error("Sending command failed:", {
      error: e,
      command: getCommandName(command),
      data: formatData(data ?? []),
      transactionId,
      message: formatData(message),
    });
    throw e;
  }
};

/** Returns the part of the response that contains the data */
export const getResponseBody = (response: Data) => {
  return response.slice(18, response.length - 2);
};
