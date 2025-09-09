import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useTestExecution<T extends { id: string; status?: string }>(
    items: T[],
    updateItemStatus: (id: string, status: string) => void,
    onRunTests?: (testConfig: any) => void
) {
    const [currentTestIndex, setCurrentTestIndex] = useState<number>(-1);

    const runAllTests = useCallback(async (buildTestPayload: (item: T) => any) => {
        if (items.length === 0 || !onRunTests) {
            toast.error("Please add at least one item and ensure test runner is available");
            return;
        }

        // Reset all statuses to pending
        items.forEach(item => updateItemStatus(item.id, "pending"));
        setCurrentTestIndex(0);

        for (let i = 0; i < items.length; i++) {
            setCurrentTestIndex(i);
            updateItemStatus(items[i].id, "running");

            try {
                const testPayload = buildTestPayload(items[i]);
                console.log(`Running test ${i + 1}/${items.length}`, testPayload);
                await onRunTests(testPayload);
                updateItemStatus(items[i].id, "completed");

                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error running test ${i + 1}:`, error);
                updateItemStatus(items[i].id, "failed");
            }
        }

        setCurrentTestIndex(-1);
        toast.success("All tests completed");
    }, [items, onRunTests, updateItemStatus]);

    const runSingleTest = useCallback(async (
        itemId: string,
        buildTestPayload: (item: T) => any
    ) => {
        const item = items.find(i => i.id === itemId);
        if (!item || !onRunTests) return;

        updateItemStatus(itemId, "running");

        try {
            const testPayload = buildTestPayload(item);
            console.log("Running single test", testPayload);
            await onRunTests(testPayload);
            updateItemStatus(itemId, "completed");
            toast.success("Test completed successfully");
        } catch (error) {
            console.error("Error running test:", error);
            updateItemStatus(itemId, "failed");
            toast.error("Test failed");
        }
    }, [items, onRunTests, updateItemStatus]);

    return {
        currentTestIndex,
        runAllTests,
        runSingleTest
    };
}
