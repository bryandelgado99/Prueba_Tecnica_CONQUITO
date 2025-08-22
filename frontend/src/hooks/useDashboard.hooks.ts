import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboard.service';
import type {DashboardData, UseDashboardReturn} from '../types';

export const useDashboardHooks = (): UseDashboardReturn => {
    const [data, setData] = useState<DashboardData>({
        professionStats: [],
        ageRangeStats: [],
        monthlyStats: []
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const [professionData, ageRangeData, monthlyData] = await Promise.all([
                dashboardService.getPersonsByProfession(),
                dashboardService.getPersonsByAgeRange(),
                dashboardService.getPersonsByMonth()
            ]);

            setData({
                professionStats: professionData,
                ageRangeStats: ageRangeData,
                monthlyStats: monthlyData
            });
        } catch (err: any) {
            setError(err.message || 'Error al cargar los datos del dashboard');
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = (): void => {
        fetchDashboardData();
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return {
        data,
        loading,
        error,
        refreshData
    };
};