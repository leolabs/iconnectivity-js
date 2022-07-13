import React, { useEffect } from "react";
import { getDevices } from "iconnectivity-js/src/index";

const test = async () => {
  const devices = await getDevices();
  console.log(devices);
};

const Component: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      test();
    }
  });

  return <div>Test</div>;
};

export default Component;
