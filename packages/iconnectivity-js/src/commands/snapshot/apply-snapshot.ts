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

export interface SetActiveSceneOptions extends CommandOptions {
  scene: 1 | 2;
}

/**
 * (helper function)
 * Sets the current scene (1 or 2).
 * I've tested this with a PlayAUDIO12.
 */
export const setActiveScene = async ({
  scene,
  ...params
}: SetActiveSceneOptions) => {
  await applySnapshot({
    ...params,
    snapshotType: SnapshotType.Scene,
    snapshotId: scene,
  });
};
