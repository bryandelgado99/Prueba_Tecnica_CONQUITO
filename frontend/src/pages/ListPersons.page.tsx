import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/button';
import { GrUserNew } from "react-icons/gr";
import { LiaUserEditSolid } from "react-icons/lia";
import { AiOutlineUserDelete } from "react-icons/ai";
import { usePersons } from '../hooks/usePersons.hooks.ts';

const ListPersons: React.FC = () => {
    const { persons, loading, error, deletePerson, refreshPersons } = usePersons();

    const handleEdit = (id: string) => {
        alert(`Editar persona con ID ${id}`);
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
            <div className="w-full h-auto inline-flex justify-end items-center py-6">
                <Button variant="default" size="sm">
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
                                    {/* Foto */}
                                    <td className="border px-4 py-2">
                                        <div className="flex justify-center items-center">
                                            {person.foto ? (
                                                <img
                                                    src={person.foto}
                                                    alt={`${person.nombres} ${person.apellidos}`}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                    No
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* ID */}
                                    <td className="border px-4 py-2">{person.id}</td>

                                    {/* Nombre */}
                                    <td className="border px-4 py-2">{person.nombres}</td>

                                    {/* Apellido */}
                                    <td className="border px-4 py-2">{person.apellidos}</td>

                                    {/* Fecha Nacimiento */}
                                    <td className="border px-4 py-2">{person.fechaNacimiento}</td>

                                    {/* Edad */}
                                    <td className="border px-4 py-2">{person.edad ?? '-'}</td>

                                    {/* Profesión */}
                                    <td className="border px-4 py-2">{person.profesion}</td>

                                    {/* Dirección */}
                                    <td className="border px-4 py-2">{person.direccion}</td>

                                    {/* Teléfono */}
                                    <td className="border px-4 py-2">{person.telefono}</td>

                                    {/* Acciones */}
                                    <td className="border px-4 py-2 w-fit">
                                        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(person.id!)}>
                                                <LiaUserEditSolid />
                                                <span className="hidden lg:inline">Editar</span>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id!)}>
                                                <AiOutlineUserDelete />
                                                <span className="hidden lg:inline">Eliminar</span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ListPersons;