import { Command } from "./commands";
import { Data, formatData } from "./util/data";
import { isValidMessage, MESSAGE_HEADER } from "./util/message";
import { mergeNumber } from "./util/number";

export interface Connectable {
  sendMessage: (message: Data) => Promise<Data>;
  supportsCommand?: (command: Command) => boolean;
}

export class Connection implements Connectable {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput
  ) {}

  /** Sends a message to the device and waits for a response. */
  sendMessage = async (message: Data) => {
    return await new Promise<Uint8Array>((res, rej) => {
      const timeout = setTimeout(() => rej(new Error("Timeout")), 500);

      const handler = (m: MIDIMessageEvent) => {
        if (!m.data.slice(0, 5).every((e, i) => MESSAGE_HEADER[i] === e)) {
          return;
        }

        if (!isValidMessage(m.data)) {
          console.warn("Invalid message received:", formatData(m.data));
          return;
        }

        if (
          mergeNumber(m.data.slice(12, 14)) !==
          mergeNumber(message.slice(12, 14))
        ) {
          return;
        }

        res(m.data);
        clearTimeout(timeout);
        this.input.removeEventListener("midimessage", handler as any);

        console.log({
          request: formatData(message),
          response: formatData(m.data),
          transactionId: mergeNumber(message.slice(12, 14)),
        });
      };

      this.input.addEventListener("midimessage", handler as any);

      try {
        this.output.send(message);
      } catch (e) {
        console.error("Sending message failed:", formatData(message));
        throw e;
      }
    });
  };
}
