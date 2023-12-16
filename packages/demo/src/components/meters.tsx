import "twin.macro";
import { MeterValue } from "iconnectivity-js";
import { FC, useEffect, useRef, useState } from "react";

/** Takes a value and returns the average of the last n values. */
const useAverage = (value: MeterValue, count: number) => {
  const lastValues = useRef<number[]>(Array(count).fill(value.valueRaw));
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

export const Meters: FC<{ meterValues: MeterValue[]; kind: string }> = ({
  meterValues,
  kind,
}) => {
  return (
    <div
      tw="mt-4 flex gap-1 h-64 overflow-hidden rounded"
      css={{ flexGrow: meterValues.length }}
    >
      {meterValues.map((ch, i) => (
        <Meter key={i} value={ch} kind={kind} />
      ))}
    </div>
  );
};
