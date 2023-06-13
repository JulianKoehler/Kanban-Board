
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Provider as Redux } from "react-redux";



export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Redux store={store}>
        <Component {...pageProps} />
      </Redux>
    </ThemeProvider>
  );
}
