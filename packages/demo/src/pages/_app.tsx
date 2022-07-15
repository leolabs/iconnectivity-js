import { AppProps } from "next/app";
import globalStyles from "../styles";

// Make all functions of the library available in the console
import * as iconnectivity from "iconnectivity-js";
(window as any).iconnectivity = iconnectivity;

const App = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return <Component {...pageProps} />;
};

export default App;
