import { boardApi } from "@/redux/slices/apiSlice";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Provider as Redux } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <ApiProvider api={boardApi}>
        <Redux store={store}>
          <Component {...pageProps} />
        </Redux>
      </ApiProvider>
    </ThemeProvider>
  );
}
