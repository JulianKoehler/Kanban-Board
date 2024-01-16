'use client';

import { store } from '@/services/redux/store';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Provider as Redux } from 'react-redux';

type RootProviders = {
    children: ReactNode;
};

const RootProviders = ({ children }: RootProviders) => {
    return (
        <Redux store={store}>
            <ThemeProvider enableSystem={true} attribute="class">
                {children}
            </ThemeProvider>
        </Redux>
    );
};

export default RootProviders;
