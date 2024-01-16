'use client';

import Toaster from '@/components/UI/Toaster/Toaster';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAvoidHydrationMismatch } from '@/hooks/useAvoidHydrationMismatch';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import { ReactNode } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

export default function Layout({
    children,
    sidebar,
    header,
}: {
    children: ReactNode;
    sidebar: ReactNode;
    header: ReactNode;
}) {
    const [theme] = useAppTheme();
    const skeletonBaseColor = theme === 'dark' ? '#2e2b35' : '#dbdbdb';
    const skeletonHighlightColor = theme === 'dark' ? '#3d3e46' : '#c2c2c2';

    const [appIsMounted] = useAvoidHydrationMismatch();
    const [_, isLoadingUser] = useGetCurrentUser();

    if (!appIsMounted || isLoadingUser) return null;

    return (
        <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
            <div className="flex">
                {sidebar}
                <div className="w-full overflow-hidden">
                    <Toaster />
                    {header}
                    {children}
                </div>
            </div>
        </SkeletonTheme>
    );
}
