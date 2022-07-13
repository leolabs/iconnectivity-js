import { Command } from "../commands";
import { splitNumber } from "./number";

export enum CommandType {
  Query = 0x40,
  Answer = 0x00,
}

/** Builds a two-byte command based on the command type and command */
export const buildCommandCode = (type: CommandType, command: Command) =>
  splitNumber((type << 7) + command);
