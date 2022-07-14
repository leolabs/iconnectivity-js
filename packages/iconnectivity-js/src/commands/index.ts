import { Connectable } from "../connection";
import { formatData } from "../util/data";
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
}: SendCommandOptions) => {
  if (device.supportsCommand && !device.supportsCommand(command)) {
    throw new Error(
      `Device does not support command ${getCommandName(command)}`
    );
  }

  const body = buildBody({
    command,
    data,
    productId,
    serialNumber,
    transactionId,
  });

  const message = buildMessage(body);

  try {
    const result = await device.sendMessage(message);

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
