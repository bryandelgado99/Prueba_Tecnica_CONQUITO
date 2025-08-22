// controllers/personController.js
import Form from "../database/models/form.model.js";
import {encodeImageToBase64} from "../utils/imageUpdater.js";

// Crear una nueva persona
export const createPerson = async (req, res) => {
    try {
        const { first_name, last_name, birth_date, profession, address, phone, photo_url } = req.body;

        if (!first_name || !last_name || !birth_date || !profession || !address || !phone) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Calcular edad
        const [year, month, day] = birth_date.split('-').map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;
        if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
            age--;
        }

        const person = await Form.create({
            first_name,
            last_name,
            birth_date,
            age,
            profession,
            address,
            phone,
            photo_url: photo_url || null // guardamos la URL que envíe el frontend
        });

        return res.status(201).json({
            message: "Persona creada exitosamente",
            data: person
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear la persona" });
    }
};

// Obtener todas las personas
export const getPersons = async (req, res) => {
    try {
        const persons = await Form.findAll();
        return res.json({
            message: "Personas obtenidas exitosamente",
            data: persons
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener las personas" });
    }
};

// Obtener una persona por ID
export const getPersonById = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await Form.findByPk(id);

        if (!person) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }

        return res.json({
            message: "Persona obtenida exitosamente",
            data: person
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener la persona" });
    }
};

// Actualizar persona
export const updatePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, birth_date, profession, address, phone, photo_url } = req.body;

        const person = await Form.findByPk(id);
        if (!person) return res.status(404).json({ error: "Persona no encontrada" });

        // Recalcular edad si se actualiza birth_date
        let age = person.age;
        if (birth_date) {
            const [year, month, day] = birth_date.split('-').map(Number);
            const today = new Date();
            age = today.getFullYear() - year;
            if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age--;
        }

        await person.update({
            first_name,
            last_name,
            birth_date,
            age,
            profession,
            address,
            phone,
            photo_url: photo_url || person.photo_url
        });

        return res.json({ message: "Persona actualizada exitosamente", data: person });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar la persona" });
    }
};


// Eliminar persona
export const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await Form.findByPk(id);

        if (!person) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }

        await person.destroy();
        return res.json({ message: "Persona eliminada correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar la persona" });
    }
};