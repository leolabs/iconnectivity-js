import { ParmList } from "../data-blocks/parm-list";
import { DataClassType, DeviceInfo, OpMode } from "../data-classes";
import { getParmVal } from "../messages/get-parm-val";
import { MessageOptions } from "../send-message";

export const getOpMode = async (params: MessageOptions) => {
  const res = await getParmVal({
    ...params,
    dataType: DataClassType.DeviceInfo,
    parmList: new ParmList([DeviceInfo.DevOpMode]),
  });

  return res.parmVals[0].values[0].data[0] as OpMode;
};
