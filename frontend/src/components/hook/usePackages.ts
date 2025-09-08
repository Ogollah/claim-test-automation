import { useState, useEffect } from 'react';
import { getPackages } from '@/lib/api';
import { Package } from '@/lib/types';

export const usePackages = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPackages();
                setPackages(response || []);
            } catch (err) {
                setError('Failed to load packages');
                console.error('Error fetching packages:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    return { packages, loading, error };
};