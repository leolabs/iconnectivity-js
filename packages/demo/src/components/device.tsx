import { FC, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import {
  Device,
  DeviceInfoType,
  getAudioPortMeterValue,
  getAutomaticFailoverState,
  getSnapshotList,
  MeterValue,
  Product,
  SnapshotType,
} from "iconnectivity-js";

const StateButton = styled.button({
  ...tw`rounded py-1 px-3 cursor-pointer tabular-nums`,
  ...tw` outline-none transition-shadow focus-visible:ring`,

  variants: {
    color: {
      green: {
        ...tw`bg-green-800 text-green-50 focus-visible:ring-green-900`,
      },
      red: {
        ...tw`bg-red-800 text-red-50 focus-visible:ring-red-900`,
      },
      gray: {
        ...tw`bg-gray-700 text-gray-50 focus-visible:ring-gray-900`,
      },
    },
  },

  defaultVariants: {
    color: "green",
  },
});

export const DeviceEntry: FC<{ device: Device }> = ({ device }) => {
  const [info, setInfo] = useState<Record<DeviceInfoType, string>>();
  const [scene, setScene] = useState<number>();
  const [failoverState, setFailoverState] = useState<{
    armed: boolean;
    alarm: boolean;
  }>();
  const [meters, setMeters] = useState<MeterValue[][]>();

  useEffect(() => {
    device.getAllInfo().then(setInfo);
  }, [device]);

  useEffect(() => {
    if (device.info.productId !== Product.PlayAUDIO12) {
      return;
    }

    const interval = setInterval(() => {
      getSnapshotList({ device, snapshotType: SnapshotType.Scene })
        .then((s) => setScene(s.lastSnapshotId))
        .catch(() => {});

      getAutomaticFailoverState({ device })
        .then((s) => setFailoverState({ armed: s.armed, alarm: s.alarm }))
        .catch(() => {});
    }, 100);

    return () => clearInterval(interval);
  }, [device]);

  useEffect(() => {
    const interval = setInterval(() => {
      Promise.all(
        [1, 2].map(async (portId) =>
          getAudioPortMeterValue({ device, portId, fetchInputs: true })
        )
      )
        .then((results) => setMeters(results.map((r) => r.inputs)))
        .catch(() => {});
    }, 50);

    return () => clearInterval(interval);
  }, [device]);

  if (!info) {
    return null;
  }

  return (
    <div tw="bg-gray-800 rounded-md shadow-md p-4">
      <div tw="flex items-center">
        <h2 tw="text-lg mr-auto">
          <span tw="font-bold">
            {info[DeviceInfoType.DeviceName] ?? "Unnamed"}
          </span>{" "}
          ({info[DeviceInfoType.SerialNumber] ?? "No Serial Number"})
        </h2>

        {scene && (
          <StateButton tw="ml-4" color={scene === 2 ? "red" : "green"}>
            Scene {scene}
          </StateButton>
        )}

        {failoverState && (
          <StateButton
            tw="ml-4"
            color={
              failoverState.alarm
                ? "red"
                : failoverState.armed
                ? "green"
                : "gray"
            }
          >
            {failoverState.alarm
              ? "Alarm"
              : failoverState.armed
              ? "Armed"
              : "Disarmed"}
          </StateButton>
        )}
      </div>

      {meters &&
        meters.map((channels, i) => (
          <div key={i} tw="mt-4 flex gap-1 h-64 overflow-hidden rounded">
            {channels.map((ch) => (
              <div tw="relative flex-1 bg-gray-700">
                <span tw="absolute inset-0 pt-1 text-center text-gray-600">
                  {ch.channel}
                </span>
                <div
                  tw="absolute bottom-0 w-full bg-green-600 transition"
                  css={{ transitionProperty: "height" }}
                  style={{ height: `${ch.valueRaw / 81.92}%` }}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
