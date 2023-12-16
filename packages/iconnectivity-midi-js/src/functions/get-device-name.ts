import { ParmList } from "../data-blocks/parm-list";
import { DataClassType, DeviceInfo } from "../data-classes";
import { getParmVal } from "../messages/get-parm-val";
import { MessageOptions } from "../send-message";
import { dataToAscii } from "../util";

export const getDeviceName = async (params: MessageOptions) => {
  const res = await getParmVal({
    ...params,
    dataType: DataClassType.DeviceInfo,
    parmList: new ParmList([DeviceInfo.ProductName]),
  });

  return dataToAscii(res.parmVals[0].values[0].data);
};
