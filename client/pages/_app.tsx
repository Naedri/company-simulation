import "../styles/globals.css";
import { AppProps } from "next/app";
import "@reach/listbox/styles.css";
import "beautiful-react-diagrams/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
