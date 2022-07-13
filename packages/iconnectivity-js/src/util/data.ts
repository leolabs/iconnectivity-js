/** Represents a chunk of data, either as a Uint8Array or as an array of numbers. */
export type Data = Uint8Array | number[];

/** Converts the given data to an array of numbers if necessary */
export const toArray = (data: Data): number[] => {
  if (data instanceof Uint8Array) {
    return [...data];
  }
  return data;
};

/** Formats an array of Uint8 values to a readable string */
export const formatData = (input: Data | null) => {
  if (!input) {
    return null;
  }

  return toArray(input)
    .map((d) => d.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
};
