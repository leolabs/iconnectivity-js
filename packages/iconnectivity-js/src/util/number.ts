import { Data } from "./data";

// From the manual:
// All fields are big-endian (most significant byte occurs first, least significant byte occurs last).
// All fields which accept values greater than 0x7F must have the value split across multiple bytes in
// order to be compatible with MIDI sysex format. The least significant 7 bits of the value are
// contained in the 7 least significant bits of the last byte. The next 7 bits are contained in the 7
// least significant bits of the last-1 byte, etc.

/** The highest number that can be represented using two bytes. */
export const MAX_NUMBER = 16383;

/** Splits a number into two bytes. */
export const splitNumber = (input: number) => {
  if (input > MAX_NUMBER) {
    throw new Error("Number can't be larger than 16383");
  }

  return [(input >> 7) & 0x7f, input & 0x7f];
};

/** Merges two bytes back into a number. */
export const mergeNumber = (input: Data) => {
  if (input.length !== 2) {
    throw new Error(
      "Number must be two bytes long, but is " + input.length + " bytes long"
    );
  }

  return input[0] * 128 + input[1];
};
