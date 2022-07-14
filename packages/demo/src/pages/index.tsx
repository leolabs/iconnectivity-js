import { DeviceManager } from "iconnectivity-js";
import { Device } from "iconnectivity-js/lib/device";
import { Product } from "iconnectivity-js/lib/types/product";
import React, { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    Promise.all(
      devices.map(async (device) => {
        const info = await device.getAllInfo();

        return {
          serialNumber: device.serialNumber,
          info,
          supportedCommands: device.getSupportedCommandNames(),
        };
      })
    ).then(setDeviceInfo);
  }, [devices]);

  return (
    <div>
      <h2>Devices:</h2>
      {error ? (
        <p>
          <b>{error}</b>
        </p>
      ) : devices.length ? (
        <ul>
          {devices.map((d) => (
            <li key={d.serialNumber}>
              <b>{Product[d.info.productId]}</b>:<br />
              <pre>
                {JSON.stringify(
                  deviceInfo.find(
                    (di: any) => di.serialNumber === d.serialNumber
                  ),
                  null,
                  2
                )}
              </pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>Connect a device to view its details here</p>
      )}
    </div>
  );
};

export default Component;
