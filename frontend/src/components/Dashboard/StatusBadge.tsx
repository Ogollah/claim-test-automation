interface StatusBadgeProps {
    status: string | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyle = (status: string | undefined) => {
        switch (status) {
            case "running":
                return "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs";
            case "completed":
                return "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs";
            case "failed":
                return "px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs";
            default:
                return "px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs";
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case "running":
                return "Running";
            case "completed":
                return "Completed";
            case "failed":
                return "Failed";
            default:
                return "Pending";
        }
    };

    return (
        <span className={getStatusStyle(status)}>
            {getStatusText(status)}
        </span>
    );
}