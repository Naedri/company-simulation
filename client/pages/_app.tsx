import "../styles/globals.css";
import { AppProps } from "next/app";
import "@reach/listbox/styles.css";
import "../librairies/src/Diagram/diagram.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
