import { useState, useEffect } from 'react';
import { getPackages, getPackagesByIsPreauth } from '@/lib/api';
import { Package } from '@/lib/types';
import { toast } from 'sonner';

export function usePackages(filterCodes?: string[]) {
    const [packages, setPackages] = useState<Package[]>([]);
    const [packageIds, setPackageIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setIsLoading(true);
                const [allPackages, preauthPackages] = await Promise.all([
                    getPackages(),
                    getPackagesByIsPreauth(1)
                ]);

                // Filter packages if codes are provided
                const filteredPackages = filterCodes
                    ? allPackages?.filter(p => filterCodes.includes(p.code)) || []
                    : allPackages || [];

                setPackages(filteredPackages);

                // Extract package IDs for preauth check
                const ids = Array.isArray(preauthPackages)
                    ? preauthPackages.map(pkg => pkg.id?.toString() ?? "").filter(Boolean)
                    : [];
                setPackageIds(ids);
            } catch (error) {
                console.error("Error fetching packages:", error);
                toast.error("Failed to load packages");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPackages();
    }, [filterCodes]);

    return { packages, packageIds, isLoading };
}
