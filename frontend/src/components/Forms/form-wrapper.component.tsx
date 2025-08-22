// PersonFormWrapper.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Button } from '../UI/button';
import type { Person, PersonFormData } from '../../types';
import PersonForm from './form.component.tsx';
import { usePersons } from '../../hooks/usePersons.hooks.ts';
import { MdOutlineArrowBackIos } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";

interface PersonFormWrapperProps {
    selectedPerson?: Person | null;
    onClose: () => void; // Para regresar al listado
}

const PersonFormWrapper: React.FC<PersonFormWrapperProps> = ({ selectedPerson, onClose }) => {
    const {
        createPerson,
        updatePerson,
        pauseAutoRefresh,
        resumeAutoRefresh,
        isAutoRefreshPaused
    } = usePersons();

    const [formMode] = useState<'create' | 'edit'>(selectedPerson ? 'edit' : 'create');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Pausar auto-refresh cuando se monta el componente
    useEffect(() => {
        pauseAutoRefresh();

        // Reanudar auto-refresh cuando se desmonta el componente
        return () => {
            resumeAutoRefresh();
        };
    }, [pauseAutoRefresh, resumeAutoRefresh]);

    const handleClose = () => {
        resumeAutoRefresh();
        onClose();
    };

    const handleSubmit = async (data: PersonFormData[]) => {
        if (isSubmitting) return; // Prevenir doble submit

        setIsSubmitting(true);
        try {
            if (formMode === 'edit' && selectedPerson?.id) {
                // Para edición, solo tomar el primer elemento del array
                await updatePerson(selectedPerson.id, data[0]);
            } else {
                // Para creación, procesar todas las personas del array
                for (const person of data) {
                    await createPerson(person);
                }
            }

            // Cerrar formulario después del éxito
            handleClose();
        } catch (err) {
            console.error('Error al guardar:', err);
            // En caso de error, no cerrar el formulario para que el usuario pueda intentar de nuevo
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función helper para convertir Person a PersonFormData
    const convertPersonToFormData = (person: Person): PersonFormData => {
        return {
            first_name: person.first_name,
            last_name: person.last_name,
            birth_date: person.birth_date,
            profession: person.profession,
            address: person.address,
            phone: person.phone,
            photo_url: person.photo_url
        };
    };

    return (
        <Card className="w-full mb-6">
            <CardHeader className="flex items-start justify-center gap-2">
                <div className="flex flex-row items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="p-0"
                        disabled={isSubmitting}
                    >
                        <MdOutlineArrowBackIos size={20}/>
                    </Button>
                    <span className="inline-flex gap-2 items-center">
                        {formMode === 'edit' ? <LiaUserEditSolid size="20" /> : <AiOutlineUserAdd size="20"/> }
                        <CardTitle>
                            {formMode === 'create' ? 'Agregar Nueva Persona' : `Editar Persona: ${selectedPerson?.first_name} ${selectedPerson?.last_name}`}
                        </CardTitle>
                    </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {/* Indicador de auto-refresh pausado */}
                    {isAutoRefreshPaused && (
                        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            ⏸️ Auto-refresh pausado
                        </div>
                    )}
                    {/* Spinner de loading */}
                    {isSubmitting && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <PersonForm
                    initialData={selectedPerson ? [convertPersonToFormData(selectedPerson)] : []}
                    isEditMode={formMode === 'edit'}
                    onSubmit={handleSubmit}
                />
            </CardContent>
        </Card>
    );
};

export default PersonFormWrapper;