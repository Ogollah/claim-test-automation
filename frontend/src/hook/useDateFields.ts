import { useState, useMemo } from 'react';

interface DateFields {
    billableStart: Date | undefined;
    billableEnd: Date | undefined;
    created: Date;
}

export function useDateFields() {
    const today = useMemo(() => new Date(), []);
    const twoDaysAgo = useMemo(() => {
        const date = new Date(today);
        date.setDate(today.getDate() - 2);
        return date;
    }, [today]);

    const [dates, setDates] = useState<DateFields>({
        billableStart: twoDaysAgo,
        billableEnd: today,
        created: today,
    });

    const updateDate = (key: keyof DateFields, date: Date | undefined) => {
        setDates(prev => ({
            ...prev,
            [key]: date,
        }));
    };

    return {
        dates,
        setDates,
        updateDate,
        today,
        twoDaysAgo
    };
}