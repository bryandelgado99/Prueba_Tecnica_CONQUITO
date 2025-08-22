import api from './api';
import type {Person, ApiResponse, PersonFormData} from '../types';

export const personService = {

    // Crear una persona
    createPerson: async (person: PersonFormData): Promise<Person> => {
        try {
            const response = await api.post<ApiResponse<Person>>('/persons/create', person);
            return response.data.data || response.data as unknown as Person;
        } catch (error) {
            console.error('Error creating person:', error);
            throw error;
        }
    },

    // Actualizar una persona
    updatePerson: async (id: number | string, person: Partial<PersonFormData>): Promise<Person> => {
        try {
            const response = await api.put<ApiResponse<Person>>(`/persons/${id}`, person);
            return response.data.data || response.data as unknown as Person;
        } catch (error) {
            console.error(`Error updating person with id ${id}:`, error);
            throw error;
        }
    },

    // Obtener todas las personas
    getAllPersons: async (): Promise<Person[]> => {
        try {
            const response = await api.get<ApiResponse<Person[]>>('/persons/all');
            return response.data.data || response.data as unknown as Person[];
        } catch (error) {
            console.error('Error fetching persons:', error);
            throw error;
        }
    },

    // Obtener una persona por id
    getPersonById: async (id: number | string): Promise<Person> => {
        try {
            const response = await api.get<ApiResponse<Person>>(`/persons/${id}`);
            return response.data.data || response.data as unknown as Person;
        } catch (error) {
            console.error(`Error fetching person with id ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una persona por id
    deletePerson: async (id: string | undefined): Promise<void> => {
        try {
            await api.delete(`/persons/${id}`);
        } catch (error) {
            console.error(`Error deleting person with id ${id}:`, error);
            throw error;
        }
    }
};

export default personService;
