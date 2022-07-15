import { FC, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import {
  AudioGlobalParm,
  AudioPortMeterValue,
  Device,
  DeviceInfoType,
  getAudioGlobalParm,
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

const Meters: FC<{ meterValues: MeterValue[]; kind: string }> = ({
  meterValues,
  kind,
}) => {
  return (
    <div
      tw="mt-4 flex gap-1 h-64 overflow-hidden rounded"
      css={{ flexGrow: meterValues.length }}
    >
      {meterValues.map((ch, i) => (
        <div tw="relative flex-1 bg-gray-700 overflow-hidden" key={i}>
          <span tw="absolute inset-0 pt-1 text-center text-gray-600">
            {kind} {ch.channel}
          </span>
          <div
            tw="absolute bottom-0 w-full bg-green-600 transition"
            css={{ transitionProperty: "height" }}
            style={{ height: `${ch.valueRaw / 81.92}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export const DeviceEntry: FC<{ device: Device }> = ({ device }) => {
  const [info, setInfo] = useState<Record<DeviceInfoType, string>>();
  const [scene, setScene] = useState<number>();
  const [failoverState, setFailoverState] = useState<{
    armed: boolean;
    alarm: boolean;
  }>();
  const [meters, setMeters] = useState<AudioPortMeterValue[]>();
  const [audioInfo, setAudioInfo] = useState<AudioGlobalParm>();

  useEffect(() => {
    device.getAllInfo().then(setInfo);
    getAudioGlobalParm({ device }).then(setAudioInfo);
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
    if (!audioInfo) {
      return;
    }

    const interval = setInterval(() => {
      Promise.all(
        Array(audioInfo.audioPortCount)
          .fill(0)
          .map(async (_, i) =>
            getAudioPortMeterValue({
              device,
              portId: i + 1,
              fetchInputs: true,
              fetchOutputs: true,
            })
          )
      )
        .then((results) => setMeters(results))
        .catch(() => {});
    }, 50);

    return () => clearInterval(interval);
  }, [device, audioInfo]);

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
          <div key={i} tw="flex gap-4">
            {channels.inputs.length > 0 && (
              <Meters meterValues={channels.inputs} kind="In" />
            )}
            {channels.outputs.length > 0 && (
              <Meters meterValues={channels.outputs} kind="Out" />
            )}
          </div>
        ))}
    </div>
  );
};
