import React, { useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";

import { DeviceManager, Device } from "iconnectivity-js";
import {
  DeviceManager as MidiDeviceManager,
  Device as MidiDevice,
  Product,
} from "iconnectivity-midi-js";
import { DeviceEntry } from "../components/device";
import Head from "next/head";
import { MidiDeviceEntry } from "../components/midi-device";

const Footer = styled.footer({
  ...tw`mt-4 text-gray-400 text-center`,

  a: {
    ...tw`hover:text-gray-300`,
  },
});

const Message = styled.div({
  ...tw`font-bold text-center rounded bg-gray-800 px-6 py-4 mb-4 shadow-md`,
});

const Component: React.FC = () => {
  const managerRef = useRef<DeviceManager>();
  const midiManagerRef = useRef<MidiDeviceManager>();
  const [error, setError] = useState<string>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("requestMIDIAccess" in navigator)) {
      setError(
        "Your browser doesn't support Web MIDI. Please use Chrome, Opera, or Edge."
      );
      return;
    }

    let unsubscribe: () => void;
    let midiUnsubscribe: () => void;

    navigator.requestMIDIAccess({ sysex: true }).then((access) => {
      console.log(
        "Got MIDI access, available devices:",
        [...access.outputs.values()]
          .map(
            (o) =>
              `\n- ${o.name} (${o.manufacturer}, ${o.state}, ${o.connection})`
          )
          .join("")
      );

      const manager = new DeviceManager(access);
      (window as any).deviceManager = manager;
      managerRef.current = manager;
      unsubscribe = manager.devicesChanged.addListener((d) => setDevices(d));

      const midiManager = new MidiDeviceManager(access, Product.PlayAUDIO1U);
      (window as any).midiDeviceManager = midiManager;
      midiManagerRef.current = midiManager;
      midiUnsubscribe = midiManager.devicesChanged.addListener((d) =>
        setMidiDevices(d)
      );
    });

    return () => {
      unsubscribe?.();
      managerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (managerRef.current) {
      console.log("Detected iConnectivity devices:", devices);
    }
  }, [devices]);

  return (
    <div tw="p-4 flex flex-col items-center mx-auto max-w-6xl">
      <Head>
        <title>
          {devices.length
            ? `${devices.length} device${
                devices.length !== 1 ? "s" : ""
              } connected – iConnectivity JS Demo`
            : `iConnectivity JS Demo`}
        </title>
      </Head>

      <h2 tw="text-3xl text-center my-10">iConnectivity Devices</h2>
      {error ? (
        <Message tw="bg-red-900">{error}</Message>
      ) : devices.length || midiDevices.length ? (
        <div tw="space-y-4 w-full">
          {midiDevices.map((d) => (
            <MidiDeviceEntry device={d} key={d.serialNumberString} />
          ))}

          {devices.map((d) => (
            <DeviceEntry device={d} key={d.serialNumberString} />
          ))}
        </div>
      ) : (
        <Message>Connect a device to view its details here.</Message>
      )}
      <Footer>
        Made by <a href="https://leolabs.org">Léo Bernard</a> |{" "}
        <a href="https://github.com/leolabs/iconnectivity-js">GitHub</a> |{" "}
        <a href="https://npmjs.com/package/iconnectivity-js">NPM</a>
      </Footer>
    </div>
  );
};

export default Component;
