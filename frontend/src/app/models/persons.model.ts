export interface Person {
  id?: number;
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

export interface PersonCreateRequest {
  first_name: string;
  last_name: string;
  birth_date: string;
  profession: string;
  address: string;
  phone: string;
  photo_url?: string;
}

export interface PersonResponse {
  message: string;
  data: Person | Person[];
}

// Lista de profesiones predefinidas
export const PROFESSIONS = [
  'Ingeniero',
  'Médico',
  'Abogado',
  'Profesor',
  'Contador',
  'Arquitecto',
  'Desarrollador de Software',
  'Diseñador',
  'Enfermero',
  'Psicólogo',
  'Dentista',
  'Veterinario',
  'Otro'
];
