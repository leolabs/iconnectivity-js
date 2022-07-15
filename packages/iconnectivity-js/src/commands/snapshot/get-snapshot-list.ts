import { CommandOptions, sendCommand, SnapshotCommand } from "..";

export enum SnapshotType {
  MidiPatchbay = 0x01,
  AudioPatchbay = 0x02,
  AudioControl = 0x03,
  MixerControl = 0x04,
  Scene = 0x7f,
}

export interface GetSnapshotListOptions extends CommandOptions {
  snapshotType: SnapshotType;
}

export interface SnapshotList {
  commandVersion: number;
  snapshotType: SnapshotType;
  loopEnabled: boolean;
  lastSnapshotId: number;
  lastSnapshotListIndex: number;
  snapshotList: number[];
}

/**
 * This command is used to get information regarding a specific snapshot list.
 *
 */
export const getSnapshotList = async ({
  snapshotType,
  ...params
}: GetSnapshotListOptions): Promise<SnapshotList> => {
  const response = await sendCommand({
    ...params,
    command: SnapshotCommand.GetSnapshotList,
    data: [snapshotType],
  });

  const snapshotListLength = response[23];
  const snapshotList = [...response.slice(24, 24 + snapshotListLength)];

  return {
    commandVersion: response[18],
    snapshotType: response[19] as SnapshotType,
    loopEnabled: !!(response[20] & 1),
    lastSnapshotId: response[21],
    lastSnapshotListIndex: response[22],
    snapshotList,
  };
};

/**
 * (helper function)
 * Returns the current scene (1 or 2).
 * I've tested this with a PlayAUDIO12.
 */
export const getActiveScene = async (params: CommandOptions) => {
  const snapshotList = await getSnapshotList({
    ...params,
    snapshotType: SnapshotType.Scene,
  });

  return snapshotList.lastSnapshotId;
};
