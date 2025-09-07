import { useState, useEffect } from 'react';

export const useTestSession = <T>(key: string, initialValue: T) => {
    const [state, setState] = useState<T>(() => {
        const stored = sessionStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as const;
};
