'use client';

import { ReactNode } from 'react';
import { store } from '@/redux/store';
import { ThemeProvider } from 'next-themes';
import { Provider as Redux } from 'react-redux';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useAppTheme } from '@/hooks/useAppTheme';

type RootProviders = {
    children: ReactNode;
};

const RootProviders = ({ children }: RootProviders) => {
    const [currentTheme] = useAppTheme();
    const skeletonBaseColor = currentTheme === 'dark' ? '#1f1d24' : '#dbdbdb';
    const skeletonHighlightColor = currentTheme === 'dark' ? '#2c2d33' : '#c2c2c2';

    return (
        <Redux store={store}>
            <ThemeProvider enableSystem={true} attribute="class">
                <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
                    {children}
                </SkeletonTheme>
            </ThemeProvider>
        </Redux>
    );
};

export default RootProviders;
