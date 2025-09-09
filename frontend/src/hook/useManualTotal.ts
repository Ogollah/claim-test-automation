import { useState, useEffect, useCallback } from 'react';

export function useManualTotal(calculatedTotal: number) {
    const [total, setTotal] = useState<number>(calculatedTotal);
    const [isManuallyChanged, setIsManuallyChanged] = useState(false);

    useEffect(() => {
        if (!isManuallyChanged) {
            setTotal(calculatedTotal);
        }
    }, [calculatedTotal, isManuallyChanged]);

    const handleTotalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setTotal(isNaN(newValue) ? 0 : newValue);
        setIsManuallyChanged(true);
    }, []);

    const resetTotal = useCallback(() => {
        setTotal(calculatedTotal);
        setIsManuallyChanged(false);
    }, [calculatedTotal]);

    return {
        total,
        isManuallyChanged,
        handleTotalChange,
        resetTotal
    };
}
