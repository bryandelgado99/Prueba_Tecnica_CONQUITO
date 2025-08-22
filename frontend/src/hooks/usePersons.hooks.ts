import { useState, useEffect, useCallback } from 'react';
import personService from '../services/persons.service.ts';
import type { Person, PersonFormData, UsePersonsReturn } from '../types';

export const usePersons = (): UsePersonsReturn => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPersons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await personService.getAllPersons();

            // Mapear los campos de la API a la interfaz Person
            const mappedPersons: Person[] = data.map(p => ({
                id: p.id,
                nombres: p.first_name,
                apellidos: p.last_name,
                fechaNacimiento: p.birth_date,
                edad: p.age,
                profesion: p.profession,
                direccion: p.address,
                telefono: p.phone,
                foto: p.photo_url,
                createdAt: p.created_at,
                updatedAt: p.updated_at
            }));

            setPersons(mappedPersons);
        } catch (err) {
            setError('Error al cargar las personas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPersons();

        // Auto-refresh cada 10 segundos
        const interval = setInterval(fetchPersons, 10000);
        return () => clearInterval(interval);
    }, [fetchPersons]);

    const createPerson = async (person: PersonFormData) => {
        try {
            await personService.createPerson(person);
            fetchPersons();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updatePerson = async (id: string, person: Partial<PersonFormData>) => {
        try {
            await personService.updatePerson(id, person);
            fetchPersons();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deletePerson = async (id: string) => {
        try {
            await personService.deletePerson(id);
            fetchPersons();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const getPersonById = async (id: string): Promise<Person | null> => {
        try {
            const person = await personService.getPersonById(id);

            if (!person) return null;

            return {
                id: person.id,
                nombres: person.first_name,
                apellidos: person.last_name,
                fechaNacimiento: person.birth_date,
                edad: person.age,
                profesion: person.profession,
                direccion: person.address,
                telefono: person.phone,
                foto: person.photo_url,
                createdAt: person.created_at,
                updatedAt: person.updated_at
            };
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    return {
        persons,
        loading,
        error,
        createPerson,
        updatePerson,
        deletePerson,
        getPersonById,
        refreshPersons: fetchPersons
    };
};