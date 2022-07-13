import { DeviceCommand } from "../commands/device";
import { HardwareInterfaceCommand } from "../commands/hardware-interface";
import { buildCommandCode, CommandType } from "./command-code";

test("buildCommandCode", () => {
  expect(
    buildCommandCode(
      CommandType.Query,
      HardwareInterfaceCommand.GetHardwareValue
    )
  ).toEqual([0x41, 0x04]);

  expect(buildCommandCode(CommandType.Query, DeviceCommand.GetInfo)).toEqual([
    0x40, 0x07,
  ]);
});
