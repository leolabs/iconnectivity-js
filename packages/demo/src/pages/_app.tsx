import { AppProps } from "next/app";
import globalStyles from "../styles";

// Make all functions of the library available in the console
if (typeof window !== "undefined") {
  (window as any).iconnectivity = require("iconnectivity-js");
}

const App = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return <Component {...pageProps} />;
};

export default App;
