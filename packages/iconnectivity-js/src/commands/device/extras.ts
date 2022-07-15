import { CommandOptions, DeviceInfoType } from "..";
import { getInfo } from "./get-info";
import { getInfoList } from "./get-info-list";

/** Returns a map of all available infos for the given device. */
export const getAllInfo = async (params: CommandOptions) => {
  const supportedInfo = await getInfoList(params);

  if (!supportedInfo) {
    return null;
  }

  const info = await Promise.all(
    supportedInfo.map(async (infoType) => ({
      infoType,
      info: await getInfo({ ...params, infoType }),
    }))
  );

  return info.reduce((acc, cur) => {
    if (cur.info) {
      acc[cur.infoType] = cur.info;
    }

    return acc;
  }, {} as Record<DeviceInfoType, string>);
};
