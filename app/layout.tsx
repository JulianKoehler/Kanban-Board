import RootProviders from '@/components/RootProviders';
import '@/styles/globals.css';
import { ReactNode } from 'react';

type RootLayoutProps = {
    children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html lang="en">
            <body>
                <RootProviders>
                    <div id="backdrop" />
                    <div id="overlay" />
                    {children}
                </RootProviders>
            </body>
        </html>
    );
};

export default RootLayout;
