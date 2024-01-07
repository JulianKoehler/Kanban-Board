import { useEffect, useState } from 'react';

export const useAvoidHydrationMismatch = () => {
    const [appIsMounted, setAppIsMounted] = useState(false);

    useEffect(() => {
        setAppIsMounted(true);
    }, []);

    return [appIsMounted] as const;
};
