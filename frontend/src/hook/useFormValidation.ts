import { useMemo } from 'react';

interface ValidationConfig {
    selectedPackage: string;
    selectedIntervention: string;
    selectedPatient: any;
    selectedProvider: any;
    itemsCount: number;
    total?: number;
}

export function useFormValidation({
    selectedPackage,
    selectedIntervention,
    selectedPatient,
    selectedProvider,
    itemsCount,
    total = 0
}: ValidationConfig) {
    const canAddIntervention = useMemo(() =>
        selectedPackage && selectedIntervention && selectedPatient && selectedProvider && total > 0,
        [selectedPackage, selectedIntervention, selectedPatient, selectedProvider, total]
    );

    const canRunTests = useMemo(() =>
        selectedPatient && selectedProvider && itemsCount > 0,
        [selectedPatient, selectedProvider, itemsCount]
    );

    return {
        canAddIntervention,
        canRunTests
    };
}