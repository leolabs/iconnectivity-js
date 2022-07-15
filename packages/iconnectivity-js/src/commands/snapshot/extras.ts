import { CommandOptions } from "..";
import { SnapshotType } from ".";
import { applySnapshot } from "./apply-snapshot";
import { getSnapshotList } from "./get-snapshot-list";

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
