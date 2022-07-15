import { AppProps } from "next/app";
import globalStyles from "../styles";

const App = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return <Component {...pageProps} />;
};

export default App;
