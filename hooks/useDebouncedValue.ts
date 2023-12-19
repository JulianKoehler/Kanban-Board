import { useEffect, useState } from 'react';

let timeoutId: NodeJS.Timeout;

function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
    return function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    } as T;
}

function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const debouncedSetter = debounce((newValue: T) => {
            setDebouncedValue(newValue);
        }, delay);

        debouncedSetter(value);

        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebouncedValue;
