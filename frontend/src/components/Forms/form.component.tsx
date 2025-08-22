import React, { useEffect, useState } from 'react';
import { Button } from '../UI/button';
import { Plus } from 'lucide-react';
import type { PersonFormData } from '../../types';
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { usePersons } from '../../hooks/usePersons.hooks.ts';
import { uploadImageToImgur } from "../../services/image-upload.service.ts";

interface PersonFormProps {
    initialData?: PersonFormData[];
    onSuccess?: () => void;
    onSubmit?: (data: PersonFormData[]) => void;
    isEditMode?: boolean;
}

const professions = ['Ingeniero/a', 'Médico/a', 'Abogado/a', 'Profesor/a', 'Diseñador/a', 'Desarrollador/a', 'Auditor/a'];

interface FormValues {
    persons: PersonFormData[];
}

const PersonForm: React.FC<PersonFormProps> = ({
                                                   initialData = [],
                                                   onSuccess,
                                                   isEditMode = false
                                               }) => {
    const [photoPreview, setPhotoPreview] = useState<{ [key: number]: string }>({});
    const [photoFiles, setPhotoFiles] = useState<{ [key: number]: File }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createPerson, updatePerson, pauseAutoRefresh, resumeAutoRefresh, calculateAge } = usePersons();

    const getMaxDate = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today.toISOString().split('T')[0];
    };

    const { control, register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
        defaultValues: {
            persons: initialData.length ? initialData : [{
                first_name: '', last_name: '', birth_date: '', age: 0,
                profession: '', address: '', phone: '', photo_url: ''
            }]
        },
    });

    const { fields, append} = useFieldArray({
        control,
        name: 'persons',
    });

    const watchPersons = watch('persons');

    useEffect(() => {
        watchPersons.forEach((p, index) => {
            if (p.birth_date) {
                const birthDate = new Date(p.birth_date);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
                if (age !== p.age) setValue(`persons.${index}.age`, age >= 0 ? age : 0);
            } else if (p.age !== 0) {
                setValue(`persons.${index}.age`, 0);
            }
        });
    }, [watchPersons, setValue]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPhotoPreview(prev => ({ ...prev, [index]: result }));
            };
            reader.readAsDataURL(file);
            setPhotoFiles(prev => ({ ...prev, [index]: file }));
        }
    };

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        pauseAutoRefresh();

        try {
            for (let index = 0; index < data.persons.length; index++) {
                const person = data.persons[index];

                let photoUrl = person.photo_url || '';
                if (photoFiles[index]) photoUrl = await uploadImageToImgur(photoFiles[index]) as string;

                const payload: PersonFormData = { ...person, photo_url: photoUrl };

                if (isEditMode && person.id) {
                    // Solo actualizar campos editables en edición
                    const updatePayload: Partial<PersonFormData> = {
                        phone: payload.phone,
                        address: payload.address,
                        profession: payload.profession,
                        photo_url: payload.photo_url
                    };
                    await updatePerson(person.id, updatePayload);
                } else {
                    await createPerson(payload);
                }
            }

            if (!isEditMode) {
                reset({ persons: [{ first_name: '', last_name: '', birth_date: '', age: 0, profession: '', address: '', phone: '', photo_url: '' }] });
                setPhotoPreview({});
                setPhotoFiles({});
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
        } finally {
            setIsSubmitting(false);
            resumeAutoRefresh();
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <span className="text-[0.75em] text-red-500">* Todos los campos son obligatorios</span>

            {fields.map((field, index) => (
                <div key={field.id} className="border p-6 rounded-lg shadow-sm space-y-4">

                    {fields.length > 1 && (
                        <div className="border-b pb-2 mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Persona {index + 1}
                            </h3>
                            {isEditMode && field.id && (
                                <span className="text-sm text-gray-500">ID: {field.id}</span>
                            )}
                        </div>
                    )}

                    {/* Foto */}
                    <div className="flex flex-col items-center space-y-2">
                        <label className="block font-medium text-gray-700 text-center">Foto de Perfil</label>
                        {!isEditMode ? (
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-gray-400 transition-colors">
                                    {photoPreview[index] ? (
                                        <img
                                            src={photoPreview[index]}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <Plus className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoChange(e, index)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                                />
                            </div>
                        ) : (
                            photoPreview[index] && (
                                <img
                                    src={photoPreview[index]}
                                    alt="Perfil"
                                    className="w-24 h-24 rounded-full object-cover border"
                                />
                            )
                        )}
                    </div>

                    {/* Campos solo para creación */}
                    {!isEditMode && (
                        <>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Nombres</label>
                                <input
                                    {...register(`persons.${index}.first_name`, { required: 'Campo obligatorio' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Apellidos</label>
                                <input
                                    {...register(`persons.${index}.last_name`, { required: 'Campo obligatorio' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    max={getMaxDate()}
                                    {...register(`persons.${index}.birth_date`, { required: 'Campo obligatorio' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </>
                    )}

                    {/* Edad */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Edad</label>
                        <input
                            type="number"
                            value={calculateAge(watchPersons[index]?.birth_date)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-md"
                        />
                        <input type="hidden" {...register(`persons.${index}.age`)} value={calculateAge(watchPersons[index]?.birth_date)} />
                    </div>

                    {/* Campos editables siempre */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Profesión</label>
                        <select
                            {...register(`persons.${index}.profession`, { required: 'Campo obligatorio' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Seleccione una profesión</option>
                            {professions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            {...register(`persons.${index}.address`, { required: 'Campo obligatorio' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            {...register(`persons.${index}.phone`, {
                                required: 'Campo obligatorio',
                                pattern: { value: /^\d{10}$/, message: 'Debe tener 10 dígitos numéricos' }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            ))}

            {!isEditMode && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ first_name: '', last_name: '', birth_date: '', age: 0, profession: '', address: '', phone: '', photo_url: '' })}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Persona
                </Button>
            )}

            <div className="pt-6 border-t">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : `Guardar ${fields.length > 1 ? `${fields.length} Personas` : 'Persona'}`}
                </Button>
            </div>
        </form>
    );
};

export default PersonForm;