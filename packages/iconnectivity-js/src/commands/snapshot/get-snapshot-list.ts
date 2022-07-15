import { CommandOptions, sendCommand } from "..";
import { SnapshotCommand, SnapshotType } from ".";

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
