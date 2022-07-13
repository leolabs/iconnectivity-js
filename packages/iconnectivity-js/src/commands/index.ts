import { formatData } from "../util/data";
import {
  BodyParameters,
  buildBody,
  buildMessage,
  isValidMessage,
  MESSAGE_HEADER,
} from "../util/message";
import { mergeNumber } from "../util/number";
import { DeviceCommand } from "./device";
import { HardwareInterfaceCommand } from "./hardware-interface";

// ===== Commands =====

export enum MidiCommand {
  GetMIDIInfo = 0x20,
  RetSetMIDIInfo = 0x21,
  GetMIDIPortInfo = 0x22,
  RetSetMIDIPortInfo = 0x23,
  GetMIDIPortFilter = 0x24,
  RetSetMIDIPortFilter = 0x25,
  GetMIDIPortRemap = 0x26,
  RetSetMIDIPortRemap = 0x27,
  GetMIDIPortRoute = 0x28,
  RetSetMIDIPortRoute = 0x29,
  GetMIDIPortDetail = 0x2a,
  RetSetMIDIPortDetail = 0x2b,
  GetRTPMIDIConnectionDetail = 0x2c,
  RetRTPMIDIConnectionDetail = 0x2d,
  GetUSBHostMIDIDeviceDetail = 0x2e,
  RetUSBHostMIDIDeviceDetail = 0x2f,
  GetMIDIMonitor = 0x70,
  RetMIDIMonitor = 0x71,
  GetRTPMIDIConnectionParm = 0x7e,
  RetRTPMIDIConnectionParm = 0x7f,
}

export enum AudioCommand {
  GetAudioGlobalParm = 0x40,
  RetSetAudioGlobalParm = 0x41,
  GetAudioPortParm = 0x42,
  RetSetAudioPortParm = 0x43,
  GetAudioDeviceParm = 0x44,
  RetSetAudioDeviceParm = 0x45,
  GetAudioControlParm = 0x46,
  RetSetAudioControlParm = 0x47,
  GetAudioControlDetail = 0x48,
  RetAudioControlDetail = 0x49,
  GetAudioControlDetailValue = 0x4a,
  RetSetAudioControlDetailValue = 0x4b,
  GetAudioClockParm = 0x4c,
  RetSetAudioClockParm = 0x4d,
  GetAudioPatchbayParm = 0x4e,
  RetSetAudioPatchbayParm = 0x4f,
  GetAudioChannelName = 0x3c,
  RetSetAudioChannelName = 0x3d,
  GetAudioPortMeterValue = 0x3e,
  RetAudioPortMeterValue = 0x3f,
}

export enum AudioMixerCommand {
  GetMixerParm = 0x50,
  RetSetMixerParm = 0x51,
  GetMixerPortParm = 0x52,
  RetSetMixerPortParm = 0x53,
  GetMixerInputParm = 0x54,
  RetSetMixerInputParm = 0x55,
  GetMixerOutputParm = 0x56,
  RetSetMixerOutputParm = 0x57,
  GetMixerInputControl = 0x58,
  RetMixerInputControl = 0x59,
  GetMixerOutputControl = 0x5a,
  RetMixerOutputControl = 0x5b,
  GetMixerInputControlValue = 0x5c,
  RetSetMixerInputControlValue = 0x5d,
  GetMixerOutputControlValue = 0x5e,
  RetSetMixerOutputControlValue = 0x5f,
  GetMixerMeterValue = 0x60,
  RetMixerMeterValue = 0x61,
}

export enum AutomationControlCommand {
  GetAutomationControl = 0x62,
  RetAutomationControl = 0x63,
  GetAutomationControlDetail = 0x64,
  RetSetAutomationControlDetail = 0x65,
}

export enum AdvancedMidiProcessorCommand {
  GetAMPGlobalParm = 0x72,
  RetAMPGlobalParm = 0x73,
  GetAMPAlgorithmParm = 0x74,
  RetSetAMPAlgorithmParm = 0x75,
  GetAMPOperatorParm = 0x76,
  RetSetAMPOperatorParm = 0x77,
  GetAMPCustomRoute = 0x78,
  RetSetAMPCustomRoute = 0x79,
  GetAMPLookupTable = 0x7a,
  RetSetAMPLookupTable = 0x7b,
  GetAMPPortInfo = 0x7c,
  RetSetAMPPortInfo = 0x7d,
}

export enum SnapshotCommand {
  RetSnapshotGlobalParm = 0x67,
  GetSnapshotParm = 0x68,
  RetSetSnapshotParm = 0x69,
  GetSnapshotList = 0x6a,
  RetSetSnapshotList = 0x6b,
  CreateSnapshot = 0x6c,
  ApplySnapshot = 0x6d,
  ApplySnapshotList = 0x6e,
}

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

/** Sends a message to the given output and waits for a response */
export const sendCommand = async ({
  output,
  input,
  command,
  productId,
  serialNumber,
  transactionId = 0,
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
