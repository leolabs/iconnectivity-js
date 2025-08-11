import { ParmVal } from "../data-blocks/parm-val";
import { DataClassType, DeviceFeature } from "../data-classes";
import { MessageOptions } from "../send-message";
import { setParmVal } from "../messages/set-parm-val";

export const setFailoverArmed = async ({
  armed,
  ...params
}: MessageOptions & {
  armed: boolean;
}) => {
  return await setParmVal({
    ...params,
    dataType: DataClassType.DeviceFeature,
    parmVal: new ParmVal([
      { id: DeviceFeature.FailoverArmStatus, data: [Number(armed)] },
    ]),
  });
};
