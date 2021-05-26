import "../styles/globals.css";
import { AppProps } from "next/app";
import { UserProvider } from "../modules/auth/auth-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
