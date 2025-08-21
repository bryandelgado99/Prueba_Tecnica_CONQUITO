import api from "./api";
import type {ProfessionStat, AgeRangeStat, MonthlyStat, ApiResponse} from '../types';

export const dashboardService = {

    // Obtener estadísticas por profesión
    getPersonsByProfession: async (): Promise<ProfessionStat[]> => {
        try {
            const response = await api.get<ApiResponse<ProfessionStat[]>>('/dashboard/profession');
            return response.data.data || response.data as unknown as ProfessionStat[];
        } catch (error) {
            console.error('Error fetching persons by profession:', error);
            throw error;
        }
    },

    // Obtener estadísticas por rango de edad
    getPersonsByAgeRange: async (): Promise<AgeRangeStat[]> => {
        try {
            const response = await api.get<ApiResponse<AgeRangeStat[]>>('/dashboard/age-range');
            return response.data.data || response.data as unknown as AgeRangeStat[];
        } catch (error) {
            console.error('Error fetching persons by age range:', error);
            throw error;
        }
    },

    // Obtener estadísticas por mes
    getPersonsByMonth: async (): Promise<MonthlyStat[]> => {
        try {
            const response = await api.get<ApiResponse<MonthlyStat[]>>('/dashboard/month');
            return response.data.data || response.data as unknown as MonthlyStat[];
        } catch (error) {
            console.error('Error fetching persons by month:', error);
            throw error;
        }
    }

}

export default dashboardService;