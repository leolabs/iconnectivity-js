import { FC, useEffect, useState } from "react";
import "twin.macro";
import {
  AudioPortMeterValue,
  Device,
  AutomaticFailoverState,
  AudioMidiState,
  getFailoverInfo,
  getMeterValues,
  getDeviceName,
  setAlarmStatus,
  setScene,
} from "iconnectivity-midi-js";
import { StateButton } from "./state-button";
import { Meters } from "./meters";

export const MidiDeviceEntry: FC<{ device: Device }> = ({ device }) => {
  const [name, setName] = useState<string>();
  const [failoverState, setFailoverState] = useState<AutomaticFailoverState>();
  const [meters, setMeters] = useState<AudioPortMeterValue[]>();

  useEffect(() => {
    getDeviceName({ device }).then(setName);
  }, [device]);

  useEffect(() => {
    const interval = setInterval(() => {
      getFailoverInfo({ device })
        .then((s) => setFailoverState(s))
        .catch(() => {});
    }, 100);

    return () => clearInterval(interval);
  }, [device]);

  useEffect(() => {
    const interval = setInterval(() => {
      Promise.all(
        Array(2)
          .fill(0)
          .map(async (_, i) =>
            getMeterValues({
              device,
              portId: i + 1,
            })
          )
      )
        .then((results) => setMeters(results))
        .catch(() => {});
    }, 50);

    return () => clearInterval(interval);
  }, [device]);

  if (!name || !failoverState) {
    return null;
  }

  return (
    <div tw="bg-gray-800 rounded-md shadow-md p-4">
      <div tw="flex items-center">
        <h2 tw="text-lg mr-auto">
          <span tw="font-bold">{name ?? "Unnamed"}</span> (
          {device.serialNumberString ?? "No Serial Number"})
        </h2>

        {failoverState && (
          <>
            <StateButton
              tw="ml-4"
              title={AudioMidiState[failoverState.mainAudioState]}
              color={
                failoverState.mainAudioState >= AudioMidiState.SendingData
                  ? "green"
                  : failoverState.mainAudioState === AudioMidiState.Connected
                  ? "gray"
                  : "red"
              }
            >
              Port A
            </StateButton>

            <StateButton
              tw="ml-4"
              title={AudioMidiState[failoverState.backupAudioState]}
              color={
                failoverState.backupAudioState >= AudioMidiState.SendingData
                  ? "green"
                  : failoverState.backupAudioState === AudioMidiState.Connected
                  ? "gray"
                  : "red"
              }
            >
              Port B
            </StateButton>
          </>
        )}

        {failoverState.scene && (
          <StateButton
            tw="ml-4"
            color={failoverState.scene === 2 ? "red" : "green"}
            onClick={() => {
              setScene({ device, scene: failoverState.scene === 1 ? 2 : 1 });
              setAlarmStatus({ device, alarmStatus: false });
            }}
          >
            Scene {failoverState.scene === 1 ? "A" : "B"}
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
            {channels.outputs.length > 0 && (
              <Meters meterValues={channels.outputs} kind="Out" />
            )}
          </div>
        ))}
    </div>
  );
};
