import { DataBlock, DataBlockType } from ".";
import { Data, getBit } from "../util";

export interface BaseParameterDefinition {
  /** Parameter ID, specific to each data class. */
  id: number;
  /** true if the parameter supports scenes */
  scene: boolean;
  scope: "preset" | "global";
}

export interface ReadOnlyParameterDefinition extends BaseParameterDefinition {
  readOnly: true;
  type: "dynamic" | "constant";
}

export interface WriteableParameterDefinition extends BaseParameterDefinition {
  readOnly: false;
  type: "normal" | "reboot";
}

export type ParameterDefinition =
  | ReadOnlyParameterDefinition
  | WriteableParameterDefinition;

/** Converts a given definition to a byte */
export const definitionToBytes = (definition: ParameterDefinition) => {
  let result = 0;

  if (definition.readOnly) {
    result = definition.type === "dynamic" ? 0b00 : 0b10;
  } else {
    result = definition.type === "normal" ? 0b01 : 0b11;
  }

  if (definition.scope === "preset") {
    result |= 0b100;
  }

  if (definition.scene) {
    result |= 0b1000;
  }

  return [definition.id, result] as const;
};

/** Converts a given definition to a string representing all flags */
export const definitionToFlagString = (definition: ParameterDefinition) => {
  let result = "";

  if (definition.readOnly) {
    result = definition.type === "dynamic" ? "RD" : "RC";
  } else {
    result = definition.type === "normal" ? "WN" : "WB";
  }

  result += definition.scope === "preset" ? "P" : "G";
  result += definition.scene ? "S" : "T";
  return result;
};

/** Converts a byte to a definition */
export const byteToDefinition = (
  id: number,
  data: number
): ParameterDefinition => {
  const writeable = getBit(data, 0);
  const scope = getBit(data, 2) ? "preset" : "global";
  const scene = Boolean(getBit(data, 3));

  if (writeable) {
    return {
      id,
      readOnly: false,
      type: getBit(data, 1) ? "reboot" : "normal",
      scene,
      scope,
    };
  } else {
    return {
      id,
      readOnly: true,
      type: getBit(data, 1) ? "constant" : "dynamic",
      scene,
      scope,
    };
  }
};

/**
 * This data block is used to define which parameters are supported
 * for a specific data class along with their attributes.
 */
export class ParmDef extends DataBlock {
  type = DataBlockType.ParmDef;

  constructor(public definitions: ParameterDefinition[]) {
    super();
  }

  static fromData(data: Data) {
    const length = data[2];
    const definitions: ParameterDefinition[] = [];

    for (let i = 0; i < length; i++) {
      const id = data[3 + i * 2];
      const flags = data[4 + i * 2];
      definitions.push(byteToDefinition(id, flags));
    }

    return new ParmDef(definitions);
  }

  getInternalData() {
    return [
      this.definitions.length,
      ...this.definitions.flatMap(definitionToBytes),
    ];
  }
}
