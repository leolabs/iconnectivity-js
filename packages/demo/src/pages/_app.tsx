import { AppProps } from "next/app";
import globalStyles from "../styles";

// Make all functions of the library available in the console
if (typeof window !== "undefined") {
  (window as any).iconnectivity = require("iconnectivity-js");

  console.log(
    [
      "iConnectivity JS Demo",
      "=====================",
      "Feel free to explore the library in the console. You can access the device manager via `deviceManager`, and all functions via `iconnectivity`.",
    ].join("\n")
  );
}

const App = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return <Component {...pageProps} />;
};

export default App;
