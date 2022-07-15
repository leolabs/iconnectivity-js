import React, { useEffect, useRef, useState } from "react";
import "twin.macro";

import { DeviceManager, Device } from "iconnectivity-js";
import { DeviceEntry } from "../components/device";

const Component: React.FC = () => {
  const managerRef = useRef<DeviceManager>();
  const [error, setError] = useState<string>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>();

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

    navigator.requestMIDIAccess({ sysex: true }).then((access) => {
      const manager = new DeviceManager(access);
      unsubscribe = manager.devicesChanged.addListener((d) => setDevices(d));
      managerRef.current = manager;
    });

    return () => unsubscribe?.();
  }, []);

  return (
    <div tw="p-4">
      <h2 tw="text-3xl text-center my-10">iConnectivity Devices</h2>
      {error ? (
        <p>
          <b>{error}</b>
        </p>
      ) : devices.length ? (
        <div>
          {devices.map((d) => (
            <DeviceEntry device={d} key={d.serialNumber} />
          ))}
        </div>
      ) : (
        <p tw="font-bold text-center">
          Connect a device to view its details here.
        </p>
      )}
    </div>
  );
};

export default Component;
