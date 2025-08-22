import { useState, useEffect, useCallback, useRef } from 'react';
import personService from '../services/persons.service.ts';
import type { Person, PersonFormData } from '../types';

export const usePersons = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAutoRefreshPaused, setIsAutoRefreshPaused] = useState<boolean>(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isFormActiveRef = useRef<boolean>(false);

    const fetchPersons = useCallback(async (showLoading: boolean = false) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const data = await personService.getAllPersons();
            setPersons(data); // Sin mapeo necesario
        } catch (err) {
            setError('Error al cargar las personas.');
            console.error(err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // Calcular edad en base a fecha de nacimiento
    const calculateAge = useCallback((birthDate?: string): number => {
        if (!birthDate) return 0;

        const birth = new Date(birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age >= 0 ? age : 0;
    }, []);


    // Función para pausar el auto-refresh
    const pauseAutoRefresh = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        isFormActiveRef.current = true;
        setIsAutoRefreshPaused(true);
        console.log('🔄 Auto-refresh pausado');
    }, []);

    // Función para reanudar el auto-refresh
    const resumeAutoRefresh = useCallback(() => {
        isFormActiveRef.current = false;
        setIsAutoRefreshPaused(false);

        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                if (!isFormActiveRef.current) {
                    fetchPersons(false);
                }
            }, 10000);
            console.log('🔄 Auto-refresh reanudado');
        }
    }, [fetchPersons]);

    // Función para inicializar el auto-refresh
    const startAutoRefresh = useCallback(() => {
        if (!intervalRef.current && !isFormActiveRef.current) {
            intervalRef.current = setInterval(() => {
                if (!isFormActiveRef.current) {
                    fetchPersons(false);
                }
            }, 10000);
        }
    }, [fetchPersons]);

    useEffect(() => {
        // Carga inicial
        fetchPersons(true);

        // Iniciar auto-refresh
        startAutoRefresh();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchPersons, startAutoRefresh]);

    const createPerson = async (person: PersonFormData) => {
        try {
            await personService.createPerson(person);
            await fetchPersons(false);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updatePerson = async (id: string, person: Partial<PersonFormData>) => {
        try {
            await personService.updatePerson(id, person);
            await fetchPersons(false);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deletePerson = async (id: string) => {
        try {
            await personService.deletePerson(id);
            await fetchPersons(false);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const getPersonById = async (id: string): Promise<Person | null> => {
        try {
            const person = await personService.getPersonById(id);

            if (!person) return null;

            return person; // Sin mapeo necesario
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const refreshPersons = () => {
        fetchPersons(true);
    };

    return {
        persons,
        loading,
        error,
        isAutoRefreshPaused,
        createPerson,
        updatePerson,
        deletePerson,
        getPersonById,
        refreshPersons,
        pauseAutoRefresh,
        resumeAutoRefresh,
        calculateAge
    };
};