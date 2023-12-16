import { MessageClass } from "./messages";
import { getMessageName } from "./send-message";
import { Data, formatData } from "./util/data";
import { isValidMessage, MESSAGE_HEADER } from "./util/message";
import { mergeNumber } from "./util/number";

export interface SendMessageOptions {
  debug?: boolean;
  messageClass: MessageClass;
  transactionId: number;
}

export interface Connectable {
  /** The device's serial number, used to send commands to a specific device. */
  serialNumber?: Data;
  /** Sends a raw MIDI message to the device and returns the raw response data. */
  sendMessage: (message: Data, options: SendMessageOptions) => Promise<Data>;
}

/** Thrown when a message doesn't receive a response within the timeout threshold */
export class TimeoutError extends Error {
  constructor(
    message: string,
    public readonly commandName: string,
    public readonly transactionId: number,
    public readonly request: string
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class Connection implements Connectable {
  constructor(
    public readonly input: MIDIInput,
    public readonly output: MIDIOutput
  ) {}

  /** Sends a message to the device and waits for a response. */
  sendMessage = async (message: Data, options: SendMessageOptions) => {
    return await new Promise<Uint8Array>((res, rej) => {
      const timeout = setTimeout(() => {
        const commandName = getMessageName(options.messageClass);
        rej(
          new TimeoutError(
            `Command ${commandName} timed out`,
            commandName,
            options.transactionId,
            formatData(message)
          )
        );
      }, 500);

      const handler = (m: MIDIMessageEvent) => {
        if (!m.data.slice(0, 5).every((e, i) => MESSAGE_HEADER[i] === e)) {
          return;
        }

        if (!isValidMessage(m.data)) {
          console.warn("Invalid message received:", formatData(m.data));
          return;
        }

        if (mergeNumber(m.data.slice(18, 20)) !== options.transactionId) {
          return;
        }

        res(m.data);
        clearTimeout(timeout);
        this.input.removeEventListener("midimessage", handler as any);

        if (options.debug) {
          console.log({
            command: getMessageName(options.messageClass),
            transactionId: options.transactionId,
            request: formatData(message),
            response: formatData(m.data),
          });
        }
      };

      this.input.addEventListener("midimessage", handler as any);
      this.output.send(message);
    });
  };
}
