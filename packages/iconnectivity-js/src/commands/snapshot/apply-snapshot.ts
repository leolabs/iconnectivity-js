import { CommandOptions, sendCommand, SnapshotCommand, SnapshotType } from "..";

export interface ApplySnapshotOptions extends CommandOptions {
  snapshotType: SnapshotType;
  snapshotId: number;
}

/**
 * This command is used to apply a snapshot.
 */
export const applySnapshot = async ({
  snapshotType,
  snapshotId,
  ...params
}: ApplySnapshotOptions) => {
  await sendCommand({
    ...params,
    command: SnapshotCommand.ApplySnapshot,
    data: [1, snapshotType, snapshotId],
  });
};
