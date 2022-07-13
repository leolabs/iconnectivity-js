/** Represents a chunk of data, either as a Uint8Array or as an array of numbers. */
export type Data = Uint8Array | number[];

/** Converts the given data to an array of numbers if necessary. */
export const toArray = (data: Data): number[] => {
  if (data instanceof Uint8Array) {
    return [...data];
  }
  return data;
};

/** Formats an array of Uint8 values to a readable string. */
export const formatData = <T extends Data | null>(
  input: T
): T extends null ? null : string => {
  if (!input) {
    return null as any;
  }

  return toArray(input)
    .map((d) => d.toString(16).padStart(2, "0").toUpperCase())
    .join(" ") as any;
};

/** Converts a given string of hex values to an array of data */
export const stringToData = (input: string): Data => {
  if (!input) {
    return [];
  }

  return input.split(" ").map((d) => parseInt(d, 16));
};
