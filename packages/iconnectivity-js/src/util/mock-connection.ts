import { Connectable } from "../connection";
import { Data, formatData, stringToData } from "./data";

/** Represents a device that can intercept requests and mock responses. */
export class MockDevice implements Connectable {
  constructor(public mockMessage: (message: Data) => Data) {}

  sendMessage = async (message: Data) => {
    return this.mockMessage(message);
  };
}

/** Tests a MIDI command given a request and response string of hex codes. */
export async function testMidiCommand<T>(
  request: string,
  response: string,
  fn: (device: Connectable) => T | Promise<T>
): Promise<Awaited<T>> {
  const mockSend = jest.fn((_: Data) => stringToData(response));
  const device = new MockDevice(mockSend);
  const result = await fn(device);
  expect(formatData(mockSend.mock.calls[0][0])).toEqual(request);
  return result;
}
