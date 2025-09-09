import { useState, useEffect } from 'react';
import { getInterventionByPackageId } from '@/lib/api';
import { Intervention } from '@/lib/types';
import { toast } from 'sonner';

export function useInterventions(packageId: string) {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [selectedIntervention, setSelectedIntervention] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!packageId) {
            setInterventions([]);
            setSelectedIntervention("");
            return;
        }

        const fetchInterventions = async () => {
            try {
                setIsLoading(true);
                const result = await getInterventionByPackageId(Number(packageId));
                const interventionsArray = Array.isArray(result) ? result : result ? [result] : [];

                setInterventions(interventionsArray);
                if (interventionsArray.length > 0) {
                    setSelectedIntervention(interventionsArray[0].code);
                }
            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterventions();
    }, [packageId]);

    return {
        interventions,
        selectedIntervention,
        setSelectedIntervention,
        isLoading
    };
}
