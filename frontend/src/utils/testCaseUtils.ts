import { TestCaseItem } from '@/lib/types';

export const groupTestCasesByIntervention = (testCases: TestCaseItem[]) => {
    const grouped = {};

    testCases?.forEach(tc => {
        if (!tc.intervention_id) return;

        const interventionId = tc.intervention_id;
        const testType = tc.test_config?.formData.test ||
            (tc.description?.toLowerCase().includes('positive') ? 'positive' :
                tc.description?.toLowerCase().includes('negative') ? 'negative' : 'other');

        if (!grouped[interventionId]) {
            grouped[interventionId] = { positive: [], negative: [] };
        }

        if (testType === 'positive') {
            grouped[interventionId].positive.push(tc);
        } else if (testType === 'negative') {
            grouped[interventionId].negative.push(tc);
        }
    });

    return grouped;
};

export const selectRandomTestCases = (groupedTestCases: any, maxPerType: number = 2) => {
    const selectedTestCases = [];

    Object.values(groupedTestCases).forEach((intervention: any) => {
        if (intervention.positive.length > 0) {
            const randomPositive = intervention.positive
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.min(maxPerType, intervention.positive.length));
            selectedTestCases.push(...randomPositive);
        }
        if (intervention.negative.length > 0) {
            const randomNegative = intervention.negative
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.min(maxPerType, intervention.negative.length));
            selectedTestCases.push(...randomNegative);
        }
    });

    return selectedTestCases;
};
