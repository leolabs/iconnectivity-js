import { FC, memo, useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";
import { isEqual } from "lodash";
import {
  AudioGlobalParm,
  AudioPortMeterValue,
  Device,
  DeviceInfoType,
  getActiveScene,
  setActiveScene,
  getAudioGlobalParm,
  getAudioPortMeterValue,
  getAutomaticFailoverState,
  MeterValue,
  Product,
} from "iconnectivity-js";

const StateButton = styled.button({
  ...tw`rounded py-1 px-3 cursor-pointer tabular-nums whitespace-nowrap`,
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

/** Takes a value and returns the average of the last n values. */
const useAverage = (value: MeterValue, count: number) => {
  const lastValues = useRef<number[]>(Array(count).fill(0));
  const [average, setAverage] = useState(0);

  useEffect(() => {
    lastValues.current.push(value.valueRaw);
    lastValues.current.shift();
    setAverage(lastValues.current.reduce((a, b) => a + b, 0) / count);
  }, [value]);

  return average;
};

const Meter: FC<{ value: MeterValue; kind: string }> = ({ value, kind }) => {
  const average = useAverage(value, 10);
  const [peak, setPeak] = useState(0);
  const [displayPeak, setDisplayPeak] = useState(0);
  const displayPeakDb = 20 * Math.log(displayPeak / 8192);

  useEffect(() => {
    const highest = Math.max(average, value.valueRaw);
    setPeak((p) => (highest > p ? highest : p - 50));
    setDisplayPeak((p) => (highest > p ? highest : p));
  }, [value]);

  return (
    <div tw="relative flex-1 bg-gray-700 overflow-hidden text-sm">
      <span tw="absolute inset-0 pt-1 text-center text-gray-600">
        {kind} {value.channel}
      </span>
      <div
        tw="absolute bottom-0 w-full transition"
        css={{
          backgroundImage: `linear-gradient(to top, green 0%, yellow 80%, red 100%)`,
          backgroundSize: `100% 16rem`,
          backgroundPosition: "bottom",
        }}
        style={{ height: `${average / 81.92}%` }}
      />
      <div
        tw="absolute w-full bg-gray-400"
        css={{
          height: 2,
          top: `${100 - Math.max(peak, average) / 81.92}%`,
        }}
      />
      <div
        tw="absolute bottom-0 w-full bg-black bg-opacity-60 tabular-nums text-center cursor-pointer text-xs sm:text-sm"
        onClick={() => setDisplayPeak(0)}
      >
        {displayPeakDb === -Infinity ? "-∞" : displayPeakDb.toFixed(1)}
      </div>
    </div>
  );
};

const MemoMeter = memo(Meter);

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
        <MemoMeter key={i} value={ch} kind={kind} />
      ))}
    </div>
  );
};

const MemoMeters = memo(Meters, isEqual);

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
      getActiveScene({ device })
        .then((s) => setScene(s))
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
          <StateButton
            tw="ml-4"
            color={scene === 2 ? "red" : "green"}
            onClick={() =>
              setActiveScene({ device, scene: scene === 1 ? 2 : 1 })
            }
          >
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
          <div key={i} tw="flex gap-3">
            {channels.inputs.length > 0 && (
              <MemoMeters meterValues={channels.inputs} kind="In" />
            )}
            {channels.outputs.length > 0 && (
              <MemoMeters meterValues={channels.outputs} kind="Out" />
            )}
          </div>
        ))}
    </div>
  );
};
