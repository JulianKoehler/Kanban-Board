import { useEffect, useState } from 'react';

const useMenuHandler = <T extends HTMLElement>(ref: React.RefObject<T>) => {
    const [showElement, setShowElement] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowElement(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [ref, setShowElement]);

    return {
        showElement,
        setShowElement,
    };
};

export default useMenuHandler;
