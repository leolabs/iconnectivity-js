import { Connectable } from "../connection";
import { BodyParameters, buildBody, buildMessage } from "../util/message";
import { MAX_NUMBER } from "../util/number";

import { AdvancedMidiProcessorCommand } from "./advanced-midi-processor";
import { AudioCommand } from "./audio";
import { AudioMixerCommand } from "./audio-mixer";
import { AutomationControlCommand } from "./automation-control";
import { DeviceCommand } from "./device";
import { HardwareInterfaceCommand } from "./hardware-interface";
import { MidiCommand } from "./midi";
import { SnapshotCommand } from "./snapshot";

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
  const body = buildBody({
    command,
    data,
    productId,
    serialNumber,
    transactionId,
  });

  const message = buildMessage(body);
  return await device.sendMessage(message);
};
