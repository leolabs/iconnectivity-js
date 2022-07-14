import { Device } from "iconnectivity-js/src/device";
import { DeviceManager } from "iconnectivity-js/src/index";
import { Product } from "iconnectivity-js/src/types/product";
import React, { useEffect, useRef, useState } from "react";

const Component: React.FC = () => {
  const managerRef = useRef<DeviceManager>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let unsubscribe: () => void;

      navigator.requestMIDIAccess({ sysex: true }).then((access) => {
        const manager = new DeviceManager(access);
        unsubscribe = manager.devicesChanged.addListener((d) => setDevices(d));
        managerRef.current = manager;
      });

      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    Promise.all(
      devices.map(async (device) => {
        const info = await device.getAllInfo();

        return {
          serialNumber: device.serialNumber,
          supportedCommands: device.getSupportedCommandNames(),
          info,
        };
      })
    ).then(setDeviceInfo);
  }, [devices]);

  return (
    <div>
      <h2>Devices:</h2>
      <ul>
        {devices.map((d) => (
          <li key={d.serialNumber}>
            {d.serialNumber} ({Product[d.info.productId]}):{" "}
            {JSON.stringify(d.info)}
          </li>
        ))}
      </ul>

      <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
    </div>
  );
};

export default Component;
