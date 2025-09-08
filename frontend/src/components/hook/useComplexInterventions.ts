import { useState, useEffect } from 'react';
import { getInterventionByComplexity } from '@/lib/api';
import { Intervention } from '@/lib/types';

export const useComplexInterventions = () => {
    const [complexInterventions, setComplexInterventions] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComplexInterventions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getInterventionByComplexity(1);
                const interventions: Intervention[] = response?.data || [];
                const interventionIds = interventions.map(intervention => intervention.id);
                setComplexInterventions(interventionIds);
            } catch (err) {
                setError('Failed to load complex interventions');
                console.error('Error fetching complex interventions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchComplexInterventions();
    }, []);

    return { complexInterventions, loading, error, setComplexInterventions };
};