import { FC, useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";
import {
  AudioGlobalParm,
  AudioPortMeterValue,
  Device,
  DeviceInfoType,
  getAllInfo,
  getActiveScene,
  setActiveScene,
  getAudioGlobalParm,
  getAudioPortMeterValue,
  getAutomaticFailoverState,
  Product,
  setAutomaticFailoverState,
  AutomaticFailoverState,
  AudioMidiState,
} from "iconnectivity-js";
import { StateButton } from "./state-button";
import { Meters } from "./meters";

export const DeviceEntry: FC<{ device: Device }> = ({ device }) => {
  const [info, setInfo] = useState<Record<DeviceInfoType, string>>();
  const [scene, setScene] = useState<number>();
  const [failoverState, setFailoverState] = useState<AutomaticFailoverState>();
  const [meters, setMeters] = useState<AudioPortMeterValue[]>();
  const [audioInfo, setAudioInfo] = useState<AudioGlobalParm>();

  useEffect(() => {
    getAllInfo({ device }).then(setInfo);
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
        .then((s) => setFailoverState(s))
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

        {scene && (
          <StateButton
            tw="ml-4"
            color={scene === 2 ? "red" : "green"}
            onClick={() =>
              setActiveScene({ device, scene: scene === 1 ? 2 : 1 })
            }
          >
            Scene {scene === 1 ? "A" : "B"}
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
            onClick={() => {
              if (failoverState.alarm) {
                setAutomaticFailoverState({ device, alarm: false });
              } else {
                setAutomaticFailoverState({
                  device,
                  armed: !failoverState.armed,
                });
              }
            }}
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
