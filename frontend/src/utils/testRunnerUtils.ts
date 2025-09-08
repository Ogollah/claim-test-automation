export const createTestRunnerButtons = (isRunning: boolean, runningSection: string | null) => {
    const getButtonClass = (disabled: boolean) =>
        `inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`;

    return { getButtonClass };
};