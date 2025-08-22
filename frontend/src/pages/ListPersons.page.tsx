import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/button';

// Datos quemados
const mockPersons = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234', fechaNacimiento: '1990-01-01', profesion: 'Ingeniero' },
    { id: 2, nombre: 'María', apellido: 'Gómez', telefono: '555-5678', fechaNacimiento: '1985-06-15', profesion: 'Diseñadora' },
    { id: 3, nombre: 'Pedro', apellido: 'Martínez', telefono: '555-9012', fechaNacimiento: '1992-09-20', profesion: 'Docente' },
    { id: 4, nombre: 'Laura', apellido: 'Rodríguez', telefono: '555-3456', fechaNacimiento: '1988-03-10', profesion: 'Abogada' },
];

const ListPersons: React.FC = () => {
    const [persons, setPersons] = useState(mockPersons);

    const handleEdit = (id: number) => {
        alert(`Editar persona con ID ${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            setPersons(persons.filter(person => person.id !== id));
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Lista de Personas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">ID</th>
                            <th className="border px-4 py-2 text-left">Nombre</th>
                            <th className="border px-4 py-2 text-left">Apellido</th>
                            <th className="border px-4 py-2 text-left">Teléfono</th>
                            <th className="border px-4 py-2 text-left">Fecha Nacimiento</th>
                            <th className="border px-4 py-2 text-left">Profesión</th>
                            <th className="border px-4 py-2 text-left">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {persons.map(person => (
                            <tr key={person.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{person.id}</td>
                                <td className="border px-4 py-2">{person.nombre}</td>
                                <td className="border px-4 py-2">{person.apellido}</td>
                                <td className="border px-4 py-2">{person.telefono}</td>
                                <td className="border px-4 py-2">{person.fechaNacimiento}</td>
                                <td className="border px-4 py-2">{person.profesion}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(person.id)}>Editar</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                        {persons.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">No hay registros disponibles</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ListPersons;

