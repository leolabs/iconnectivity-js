import { ParmVal } from "../data-blocks/parm-val";
import { HstSesnVal } from "../messages/hst-sesn-val";
import { MessageOptions, sendMessage } from "../send-message";
import { splitNumber, mergeNumber } from "../util";

export const discoverDevice = async (params: MessageOptions) => {
  const deviceInfo = await sendMessage({
    ...params,
    message: new HstSesnVal([
      new ParmVal([{ id: 0x01, data: splitNumber(256) }]),
    ]),
  });

  const productId = mergeNumber(deviceInfo.slice(5, 7));
  const serial = deviceInfo.slice(7, 12);

  if (serial.length !== 5) {
    throw new Error("Serial isn't in a correct format");
  }

  return { productId, serial };
};
