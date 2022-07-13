import { formatData } from "../util/data";
import {
  BodyParameters,
  buildBody,
  buildMessage,
  isValidMessage,
  MESSAGE_HEADER,
} from "../util/message";
import { MAX_NUMBER, mergeNumber } from "../util/number";

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
  output: MIDIOutput;
  input: MIDIInput;
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
  output,
  input,
  command,
  productId,
  serialNumber,
  transactionId = getNextTransactionId(),
  data,
}: SendCommandOptions) => {
  return await new Promise<Uint8Array>((res, rej) => {
    const timeout = setTimeout(() => rej(new Error("Timeout")), 100);

    const handler = (m: MIDIMessageEvent) => {
      if (!m.data.slice(0, 5).every((e, i) => MESSAGE_HEADER[i] === e)) {
        return;
      }

      if (!isValidMessage(m.data)) {
        console.warn("Invalid message received:", formatData(m.data));
        return;
      }

      if (mergeNumber(m.data.slice(12, 14)) !== transactionId) {
        return;
      }

      res(m.data);
      clearTimeout(timeout);
      input.removeEventListener("midimessage", handler as any);
    };

    input.addEventListener("midimessage", handler as any);

    const body = buildBody({
      command,
      data,
      productId,
      serialNumber,
      transactionId,
    });

    const message = buildMessage(body);
    output.send(message);
  });
};
