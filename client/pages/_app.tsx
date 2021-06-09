import "../styles/globals.css";
import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import "@reach/listbox/styles.css";
import "beautiful-react-diagrams/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={6000}
        placement="bottom-center"
      >
        <Component {...pageProps} />
      </ToastProvider>
    </>
  );
}

export default MyApp;
