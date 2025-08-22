export interface Person {
    id?: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    age?: number;
    profession: string;
    address: string;
    phone: string;
    photo_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PersonFormData {
    id?: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    profession: string;
    age?: number;
    address: string;
    phone: string;
    photo_url?: string;
}

// Tipos para el Dashboard
export interface ProfessionStat {
    profession: string;
    count: number;
}

export interface AgeRangeStat {
    ageRange: string;
    count: number;
}

export interface MonthlyStat {
    month: number;
    count: number;
}

export interface DashboardData {
    professionStats: ProfessionStat[];
    ageRangeStats: AgeRangeStat[];
    monthlyStats: MonthlyStat[];
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}

// Tipos de componentes
export interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface ChartProps {
    data: any[];
    title?: string;
}

// Tipos de hooks
export interface UseDashboardReturn {
    data: DashboardData;
    loading: boolean;
    error: string | null;
    refreshData: () => void;
}

export interface UsePersonsReturn {
    persons: Person[];
    loading: boolean;
    error: string | null;
    isAutoRefreshPaused: boolean;
    createPerson: (person: PersonFormData) => Promise<void>;
    updatePerson: (id: string, person: Partial<PersonFormData>) => Promise<void>;
    deletePerson: (id: string) => Promise<void>;
    getPersonById: (id: string) => Promise<Person | null>;
    refreshPersons: () => void;
    pauseAutoRefresh: () => void;
    resumeAutoRefresh: () => void;
}