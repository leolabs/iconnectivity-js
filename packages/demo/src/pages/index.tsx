import React, { useEffect, useRef, useState } from "react";
import { iConnectivity } from "iconnectivity-js/src/index";
import { Device } from "iconnectivity-js/src/device";
import { indexOf } from "lodash";
import { ProductID } from "iconnectivity-js/src/types/product";

const Component: React.FC = () => {
  const managerRef = useRef<iConnectivity>();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let unsubscribe: () => void;

      navigator.requestMIDIAccess({ sysex: true }).then((access) => {
        const manager = new iConnectivity(access);
        unsubscribe = manager.devicesChanged.addListener((d) => setDevices(d));
        managerRef.current = manager;
      });

      return unsubscribe;
    }
  }, []);

  return (
    <div>
      <h2>Devices:</h2>
      <ul>
        {devices.map((d) => (
          <li key={d.serialNumber}>
            {d.serialNumber} ({ProductID[d.info.productId]}):{" "}
            {JSON.stringify(d.info)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Component;
