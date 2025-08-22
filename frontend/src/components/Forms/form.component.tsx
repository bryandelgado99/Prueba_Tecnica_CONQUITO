import React, { useEffect, useState } from 'react';
import { Button } from '../UI/button';
import { Plus } from 'lucide-react';
import type { PersonFormData } from '../../types';
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { usePersons } from '../../hooks/usePersons.hooks.ts';

interface PersonFormProps {
    initialData?: PersonFormData[];
    onSubmit?: (data: PersonFormData[]) => void; // Ahora opcional
    onSuccess?: () => void; // Callback opcional para cuando se completa el guardado
    isEditMode?: boolean;
}

const professions = ['Ingeniero/a', 'Médico/a', 'Abogado/a', 'Profesor/a', 'Diseñador/a', 'Desarrollador/a', 'Auditor/a'];

interface FormValues {
    persons: PersonFormData[];
}

const PersonForm: React.FC<PersonFormProps> = ({
                                                   initialData = [],
                                                   onSubmit,
                                                   onSuccess,
                                                   isEditMode = false
                                               }) => {
    const [photoPreview, setPhotoPreview] = useState<{ [key: number]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Usar el hook de personas
    const {
        createPerson,
        updatePerson,
        pauseAutoRefresh,
        resumeAutoRefresh,
        calculateAge
    } = usePersons();

    // Obtener la fecha máxima (ayer)
    const getMaxDate = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today.toISOString().split('T')[0];
    };

    const { control, register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            persons: initialData.length ? initialData : [{
                first_name: '', last_name: '', birth_date: '', age: 0, profession: '', address: '', phone: '', photo_url: undefined
            }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'persons',
    });

    // Calcular edad automáticamente cuando cambia la fecha de nacimiento
    const watchPersons = watch('persons');

    useEffect(() => {
        watchPersons.forEach((p, index) => {
            if (p.birth_date) {
                const birthDate = new Date(p.birth_date);
                const today = new Date();

                // Calcular edad más precisa
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                // Solo actualizar si la edad calculada es diferente a la actual
                if (age !== p.age) {
                    setValue(`persons.${index}.age`, age >= 0 ? age : 0);
                }
            } else {
                // Si no hay fecha de nacimiento, resetear la edad a 0
                if (p.age !== 0) {
                    setValue(`persons.${index}.age`, 0);
                }
            }
        });
    }, [watchPersons, setValue]);

    // Manejar la vista previa de la foto
    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPhotoPreview(prev => ({ ...prev, [index]: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit handler que maneja múltiples personas
    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        pauseAutoRefresh();

        try {
            // Si hay un onSubmit personalizado, usarlo
            if (onSubmit) {
                onSubmit(data.persons);
                return;
            }

            // Procesar cada persona individualmente
            const results = await Promise.allSettled(
                data.persons.map(async (person, index) => {
                    try {
                        if (isEditMode && person.id) {
                            await updatePerson(person.id, person);
                            return { success: true, index };
                        } else {
                            await createPerson(person);
                            return { success: true, index };
                        }
                    } catch (error) {
                        return { success: false, index, error };
                    }
                })
            );

            // Analizar resultados
            const successful = results.filter(result => result.status === 'fulfilled' && result.value.success);
            const failed = results.filter(result => result.status === 'rejected' || !result.value.success);

            if (failed.length === 0) {
                // Todos exitosos
                console.log(`✅ ${successful.length} persona(s) guardada(s) exitosamente`);

                // Resetear formulario si no es modo edición
                if (!isEditMode) {
                    reset({
                        persons: [{
                            first_name: '', last_name: '', birth_date: '', age: 0, profession: '', address: '', phone: '', photo_url: undefined
                        }]
                    });
                    setPhotoPreview({});
                }

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                console.error(`❌ ${failed.length} persona(s) fallaron, ${successful.length} exitosas`);
            }

        } catch (error) {
            console.error('Error al procesar el formulario:', error);
        } finally {
            setIsSubmitting(false);
            resumeAutoRefresh();
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="border p-6 rounded-lg shadow-sm space-y-4">

                    {/* Header con número de persona si hay múltiples */}
                    {fields.length > 1 && (
                        <div className="border-b pb-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Persona {index + 1}
                            </h3>
                        </div>
                    )}

                    {/* Foto - Primer campo con diseño circular */}
                    <div className="flex flex-col items-center space-y-2">
                        <label className="block font-medium text-gray-700 text-center">Foto de Perfil</label>
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
                                {...register(`persons.${index}.photo_url`)}
                                onChange={(e) => handlePhotoChange(e, index)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                            />
                        </div>
                        <p className="text-xs text-gray-500">Click para seleccionar imagen</p>
                    </div>

                    {/* Nombres */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Nombres</label>
                        <input
                            {...register(`persons.${index}.first_name`, {
                                required: 'Campo obligatorio',
                                pattern: {
                                    value: /^[A-Z][a-zA-Z\s]*$/,
                                    message: 'Debe iniciar con mayúscula y solo letras'
                                },
                                disabled: isEditMode
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Ingrese los nombres"
                        />
                        {errors.persons?.[index]?.first_name && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].first_name.message}</span>
                        )}
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Apellidos</label>
                        <input
                            {...register(`persons.${index}.last_name`, {
                                required: 'Campo obligatorio',
                                pattern: {
                                    value: /^[A-Z][a-zA-Z\s]*$/,
                                    message: 'Debe iniciar con mayúscula y solo letras'
                                },
                                disabled: isEditMode
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Ingrese los apellidos"
                        />
                        {errors.persons?.[index]?.last_name && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].last_name.message}</span>
                        )}
                    </div>

                    {/* Fecha de nacimiento */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            max={getMaxDate()}
                            {...register(`persons.${index}.birth_date`, {
                                required: 'Campo obligatorio',
                                validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate >= today) {
                                        return 'La fecha debe ser anterior a hoy';
                                    }
                                    return true;
                                },
                                disabled: isEditMode
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        {errors.persons?.[index]?.birth_date && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].birth_date.message}</span>
                        )}
                    </div>

                    {/* Edad calculada automáticamente */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Edad (calculada automáticamente)
                        </label>
                        <input
                            type="number"
                            value={calculateAge(watchPersons[index]?.birth_date)}
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-md cursor-not-allowed"
                            disabled
                            readOnly
                        />
                        {/* Guardamos también en el form */}
                        <input
                            type="hidden"
                            {...register(`persons.${index}.age`)}
                            value={calculateAge(watchPersons[index]?.birth_date)}
                        />
                    </div>

                    {/* Profesión */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Profesión</label>
                        <select
                            {...register(`persons.${index}.profession`, { required: 'Campo obligatorio', disabled: isEditMode })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            <option value="">Seleccione una profesión</option>
                            {professions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {errors.persons?.[index]?.profession && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].profession.message}</span>
                        )}
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            {...register(`persons.${index}.address`, { required: 'Campo obligatorio' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Ingrese la dirección"
                            disabled={isEditMode}
                        />
                        {errors.persons?.[index]?.address && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].address.message}</span>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            {...register(`persons.${index}.phone`, {
                                required: 'Campo obligatorio',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: 'Debe tener 10 dígitos numéricos'
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234567890"
                        />
                        {errors.persons?.[index]?.phone && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.persons[index].phone.message}</span>
                        )}
                    </div>

                    {/* Botón eliminar (solo en modo creación y si hay más de una persona) */}
                    {!isEditMode && fields.length > 1 && (
                        <div className="pt-4 border-t">
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                    remove(index);
                                    // Limpiar preview de foto al eliminar
                                    setPhotoPreview(prev => {
                                        const newPreview = { ...prev };
                                        delete newPreview[index];
                                        return newPreview;
                                    });
                                }}
                                disabled={isSubmitting}
                            >
                                Eliminar Persona {index + 1}
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {/* Botón agregar nuevo (solo en modo creación) */}
            {!isEditMode && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({
                        first_name: '', last_name: '', birth_date: '', age: 0, profession: '', address: '', phone: '', photo_url: undefined
                    })}
                    className="w-full"
                    disabled={isSubmitting}
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
                    {isSubmitting
                        ? 'Guardando...'
                        : `Guardar ${fields.length > 1 ? `${fields.length} Personas` : 'Persona'}`
                    }
                </Button>
            </div>

            {/* Información adicional cuando hay múltiples personas */}
            {fields.length > 1 && !isSubmitting && (
                <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                    💡 Se procesarán {fields.length} personas de forma individual
                </div>
            )}
        </form>
    );
};

export default PersonForm;