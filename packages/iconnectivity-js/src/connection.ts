import { Data, formatData } from "./util/data";
import { isValidMessage, MESSAGE_HEADER } from "./util/message";
import { mergeNumber } from "./util/number";

export interface Connectable {
  sendMessage: (message: Data) => Promise<Data>;
}

export class Connection implements Connectable {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput
  ) {}

  /** Sends a message to the device and waits for a response. */
  sendMessage = async (message: Data) => {
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

        if (
          mergeNumber(m.data.slice(12, 14)) !==
          mergeNumber(message.slice(12, 14))
        ) {
          return;
        }

        res(m.data);
        clearTimeout(timeout);
        this.input.removeEventListener("midimessage", handler as any);
      };

      this.input.addEventListener("midimessage", handler as any);
      this.output.send(message);
    });
  };
}
