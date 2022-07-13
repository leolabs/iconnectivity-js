import { HardwareInterfaceCommand } from "../commands/hardware-interface";
import { buildCommandCode, CommandType } from "./command-code";

test("buildCommandCode", () => {
  expect(
    buildCommandCode(
      CommandType.Query,
      HardwareInterfaceCommand.GetHardwareValue
    )
  ).toEqual([0x41, 0x04]);
});
