import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns/format';
import { PER_DIEM_CODES } from '@/lib/utils';

interface CurrentIntervention {
    days: string;
    unitPrice: string;
    serviceStart: string;
    serviceEnd: string;
}

export function useCurrentIntervention(selectedIntervention: string, twoDaysAgo: Date, today: Date) {
    const [intervention, setIntervention] = useState<CurrentIntervention>({
        days: "1",
        unitPrice: "10000",
        serviceStart: format(twoDaysAgo, "yyyy-MM-dd"),
        serviceEnd: format(today, "yyyy-MM-dd"),
    });

    const isPerdiem = useMemo(() =>
        PER_DIEM_CODES.has(selectedIntervention),
        [selectedIntervention]
    );

    const netValue = useMemo(() =>
        Number(intervention.days) * Number(intervention.unitPrice) || 0,
        [intervention.days, intervention.unitPrice]
    );

    // Auto-calculate days for per diem interventions
    useEffect(() => {
        if (isPerdiem && intervention.serviceStart && intervention.serviceEnd) {
            try {
                const start = new Date(intervention.serviceStart);
                const end = new Date(intervention.serviceEnd);

                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const diffInMs = end.getTime() - start.getTime();
                    const diffInDays = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));

                    setIntervention(prev => ({
                        ...prev,
                        days: String(diffInDays),
                    }));
                }
            } catch (error) {
                console.error("Error calculating date difference:", error);
            }
        } else {
            setIntervention(prev => ({
                ...prev,
                days: "1",
            }));
        }
    }, [isPerdiem, intervention.serviceStart, intervention.serviceEnd]);

    const updateIntervention = (key: keyof CurrentIntervention, value: string) => {
        setIntervention(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetIntervention = () => {
        setIntervention(prev => ({
            days: prev.days,
            unitPrice: "10000",
            serviceStart: prev.serviceStart,
            serviceEnd: prev.serviceEnd,
        }));
    };

    return {
        intervention,
        setIntervention,
        updateIntervention,
        resetIntervention,
        isPerdiem,
        netValue
    };
}