import { useMemo } from 'react';
import { TestCaseItem } from '@/lib/types';

export const useTestCaseProcessing = (testCases: TestCaseItem[]) => {
    const processedTestCases = useMemo(() => {
        if (!testCases?.length) {
            return { positive: [], negative: [] };
        }

        const positiveCases = testCases.filter(item => item.description === 'positive');
        const negativeCases = testCases.filter(item => item.description === 'negative');

        return {
            positive: positiveCases,
            negative: negativeCases
        };
    }, [testCases]);

    return processedTestCases;
};