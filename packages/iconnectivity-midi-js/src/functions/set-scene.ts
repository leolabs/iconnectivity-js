import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType, DeviceFeature } from "../data-classes";
import { MessageOptions } from "../send-message";
import { setParmVal } from "../messages/set-parm-val";

export const setScene = async ({
  scene,
  ...params
}: MessageOptions & {
  scene: 1 | 2;
}) => {
  return await setParmVal({
    ...params,
    dataType: DataClassType.DeviceFeature,
    parmVal: new ParmVal([{ id: DeviceFeature.SceneNumber, data: [scene] }]),
  });
};
