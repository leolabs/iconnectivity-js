import React, { useEffect, useRef, useState } from "react";
import { DeviceManager } from "iconnectivity-js/src/index";
import { Device } from "iconnectivity-js/src/device";
import { getCommandList } from "iconnectivity-js/src/commands/device/get-command-list";
import { getInfoList } from "iconnectivity-js/src/commands/device/get-info-list";
import { getInfo } from "iconnectivity-js/src/commands/device/get-info";
import { Product } from "iconnectivity-js/src/types/product";
import { DeviceInfoType } from "iconnectivity-js/src/commands/device";

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
        const supportedCommands = await getCommandList({ device });
        const info = await device.getAllInfo();

        return {
          serialNumber: device.serialNumber,
          supportedCommands,
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
