import { DataBlockType } from ".";
import { Data } from "../util";
import { ArgVal } from "./arg-val";
import { CmdDef } from "./cmd-def";
import { CmdVal } from "./cmd-val";
import { ParmDef } from "./parm-def";
import { ParmList } from "./parm-list";
import { ParmVal } from "./parm-val";

export const parseDataBlock = (input: Data) => {
  if (input.length < 3) {
    throw new Error("Input is too short");
  }

  switch (input[1]) {
    case DataBlockType.ParmList:
      return ParmList.fromData(input);
    case DataBlockType.ParmDef:
      return ParmDef.fromData(input);
    case DataBlockType.ParmVal:
      return ParmVal.fromData(input);
    case DataBlockType.ArgVal:
      return ArgVal.fromData(input);
    case DataBlockType.CmdDef:
      return CmdDef.fromData(input);
    case DataBlockType.CmdVal:
      return CmdVal.fromData(input);
    default:
      throw new Error(`Unknown data block type ${input[1]}`);
  }
};
