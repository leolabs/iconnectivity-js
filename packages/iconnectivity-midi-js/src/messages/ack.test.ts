import { describe, expect, it } from "vitest";
import { Ack, ErrorCode } from "./ack";
import { MessageClass } from ".";
import { DataClassType } from "../data-classes";

const TEST_DATA = [
  ...[0x40, 0x00], // message class, data class of this message
  ...[0x01, 0x02], // message class, data class
  0x00, // ErrorCode: no error
];

describe("Ack Message", () => {
  it("should return the proper data", () => {
    const msg = new Ack(
      MessageClass.HstSesnVal,
      DataClassType.DeviceInfo,
      ErrorCode.NoError
    );
    expect(msg.toData()).toEqual(TEST_DATA);
  });

  it("should properly parse an Ack message from bytes", () => {
    const ack = Ack.fromData(TEST_DATA);
    expect(ack.hostMessageClass).toBe(MessageClass.HstSesnVal);
    expect(ack.hostDataClass).toBe(DataClassType.DeviceInfo);
    expect(ack.errorCode).toBe(ErrorCode.NoError);
  });
});
