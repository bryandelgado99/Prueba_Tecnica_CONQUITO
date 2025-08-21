export interface Person {
    id?: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    edad?: number;
    profesion: string;
    direccion: string;
    telefono: string;
    foto?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PersonFormData {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    profesion: string;
    direccion: string;
    telefono: string;
    foto?: File | string;
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
    createPerson: (person: PersonFormData) => Promise<void>;
    updatePerson: (id: string, person: Partial<PersonFormData>) => Promise<void>;
    deletePerson: (id: string) => Promise<void>;
    getPersonById: (id: string) => Promise<Person | null>;
    refreshPersons: () => void;
}