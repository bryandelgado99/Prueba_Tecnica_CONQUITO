import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/button';
import { usePersons } from '../hooks/usePersons.hooks';
import type { Person, PersonFormData } from '../types';
import PersonForm from '../components/Forms/form.component';

interface Props {
    mode: 'create' | 'edit';
}

const PersonFormPage: React.FC<Props> = ({ mode }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { persons, createPerson, updatePerson } = usePersons();
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    useEffect(() => {
        if (mode === 'edit' && id) {
            const person = persons.find(p => p.id === id) || null;
            setSelectedPerson(person);
        }
    }, [mode, id, persons]);

    const handleSubmit = async (data: PersonFormData[]) => {
        try {
            if (mode === 'edit' && selectedPerson?.id) {
                await updatePerson(selectedPerson.id, data[0]);
            } else {
                for (const person of data) {
                    await createPerson(person);
                }
            }
            navigate('/persons'); // volver a la lista
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'Agregar Nueva Persona' : 'Editar Persona'}</CardTitle>
            </CardHeader>
            <CardContent>
                <PersonForm
                    initialData={selectedPerson ? [{
                        first_name: selectedPerson.first_name,
                        last_name: selectedPerson.last_name,
                        birth_date: selectedPerson.birth_date,
                        profession: selectedPerson.profession,
                        address: selectedPerson.address,
                        phone: selectedPerson.phone,
                        photo_url: selectedPerson.photo_url
                    }] : []}
                    isEditMode={mode === 'edit'}
                    onSubmit={handleSubmit}
                />
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/persons')}>
                    Cancelar
                </Button>
            </CardContent>
        </Card>
    );
};

export default PersonFormPage;