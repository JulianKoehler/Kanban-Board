'use client';

import { CurrentBoardIdProvider } from '@/services/context/active-board/active-board-context';
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
            <CurrentBoardIdProvider>
                <ThemeProvider enableSystem={true} attribute="class">
                    {children}
                </ThemeProvider>
            </CurrentBoardIdProvider>
        </Redux>
    );
};

export default RootProviders;
