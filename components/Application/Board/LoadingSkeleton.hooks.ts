import { useEffect, useState } from 'react';

export const useTimeout = (timeoutId: NodeJS.Timeout, duration: number) => {
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        timeoutId = setTimeout(() => {
            setShowSkeleton(true);
        }, duration);

        return () => clearTimeout(timeoutId);
    }, []);

    return showSkeleton;
};
