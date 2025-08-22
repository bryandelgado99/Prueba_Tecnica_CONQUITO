import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/button';
import { GrUserNew } from "react-icons/gr";
import { LiaUserEditSolid } from "react-icons/lia";
import { usePersons } from '../hooks/usePersons.hooks.ts';
import type { Person } from '../types';
import PersonFormWrapper from '../components/Forms/form-wrapper.component.tsx';

const ListPersons: React.FC = () => {
    const { persons, loading, error, deletePerson, isAutoRefreshPaused } = usePersons();
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleNew = () => {
        setSelectedPerson(null); // Para nuevo usuario
        setShowForm(true); // Mostrar formulario
    };

    const handleEdit = (person: Person) => {
        setSelectedPerson(person); // Para editar usuario existente
        setShowForm(true); // Mostrar formulario
    };

    const handleCloseForm = () => {
        setSelectedPerson(null);
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            deletePerson(id);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <span className="text-gray-600">Cargando personas...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <>
            {/* Mostrar tabla solo cuando NO se esté mostrando el formulario */}
            {!showForm && (
                <>
                    <div className="w-full h-auto inline-flex justify-between items-center py-6">
                        {/* Indicador de auto-refresh */}
                        <div className="flex items-center">
                            {isAutoRefreshPaused ? (
                                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                                    ⏸️ Auto-refresh pausado
                                </div>
                            ) : (
                                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                    🔄 Auto-refresh activo
                                </div>
                            )}
                        </div>

                        <Button variant="default" size="sm" onClick={handleNew}>
                            <GrUserNew />
                            Nuevo Usuario
                        </Button>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Lista de Personas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Foto</th>
                                        <th className="border px-4 py-2 text-left">ID</th>
                                        <th className="border px-4 py-2 text-left">Nombre</th>
                                        <th className="border px-4 py-2 text-left">Apellido</th>
                                        <th className="border px-4 py-2 text-left">Fecha Nacimiento</th>
                                        <th className="border px-4 py-2 text-left">Edad</th>
                                        <th className="border px-4 py-2 text-left">Profesión</th>
                                        <th className="border px-4 py-2 text-left">Dirección</th>
                                        <th className="border px-4 py-2 text-left">Teléfono</th>
                                        <th className="border px-4 py-2 text-left">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {persons.map(person => (
                                        <tr key={person.id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2 flex justify-center items-center">
                                                {person.photo_url ? (
                                                    <img
                                                        src={person.photo_url}
                                                        alt={`${person.first_name} ${person.last_name}`}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                        No
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">{person.id}</td>
                                            <td className="border px-4 py-2">{person.first_name}</td>
                                            <td className="border px-4 py-2">{person.last_name}</td>
                                            <td className="border px-4 py-2">{person.birth_date}</td>
                                            <td className="border px-4 py-2">{person.age ?? '-'}</td>
                                            <td className="border px-4 py-2">{person.profession}</td>
                                            <td className="border px-4 py-2">{person.address}</td>
                                            <td className="border px-4 py-2">{person.phone}</td>
                                            <td className="border px-4 py-2 w-fit">
                                                <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(person)}>
                                                        <LiaUserEditSolid />
                                                        <span className="hidden lg:inline">Editar</span>
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id!)}>
                                                        <span className="hidden lg:inline">Eliminar</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {persons.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="text-center py-4 text-gray-500">
                                                No hay registros disponibles
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Mostrar formulario cuando showForm sea true */}
            {showForm && (
                <PersonFormWrapper
                    selectedPerson={selectedPerson} // null para nuevo, object para editar
                    onClose={handleCloseForm}
                />
            )}
        </>
    );
};

export default ListPersons;