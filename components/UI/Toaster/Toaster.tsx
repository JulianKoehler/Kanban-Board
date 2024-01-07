'use client';

import { useAppTheme } from '@/hooks/useAppTheme';
import { Toaster as _Toaster } from 'react-hot-toast';

const Toaster = () => {
    const [currentTheme] = useAppTheme();

    return (
        <div>
            <_Toaster
                toastOptions={{
                    style: {
                        borderRadius: '4rem',
                        background: currentTheme === 'dark' ? '#2B2C37' : '#F4F7FD',
                        color: currentTheme === 'dark' ? 'white' : 'black',
                    },
                }}
            />
        </div>
    );
};

export default Toaster;
