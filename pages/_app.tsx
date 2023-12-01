import '@/styles/globals.css';
import { api } from '@/redux/api/api';
import { store } from '@/redux/store';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Provider as Redux } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <ApiProvider api={api}>
                <Redux store={store}>
                    <Component {...pageProps} />
                </Redux>
            </ApiProvider>
        </ThemeProvider>
    );
}
