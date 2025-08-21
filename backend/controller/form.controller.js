// controllers/personController.js
import Form from "../database/models/form.model.js";

// Crear una nueva persona
export const createPerson = async (req, res) => {
    try {
        const { first_name, last_name, birth_date, profession, address, phone, photo_url } = req.body;

        // Validación rápida
        if (!first_name || !last_name || !birth_date || !profession || !address || !phone) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // ========== CALCULAR EDAD DIRECTAMENTE ==========
        console.log('=== CALCULANDO EDAD ===');
        console.log('Fecha de nacimiento recibida:', birth_date);

        // Extraer año, mes, día del string "1990-05-15"
        const [birthYear, birthMonth, birthDay] = birth_date.split('-').map(num => parseInt(num));

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // getMonth() es 0-indexed
        const currentDay = today.getDate();

        console.log(`Nacimiento: ${birthDay}/${birthMonth}/${birthYear}`);
        console.log(`Hoy: ${currentDay}/${currentMonth}/${currentYear}`);

        let age = currentYear - birthYear;

        // Si aún no ha cumplido años este año, restar 1
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }

        console.log(`Edad calculada: ${age}`);
        // ===============================================

        console.log('Datos a crear:', {
            first_name,
            last_name,
            birth_date,
            age,
            profession,
            address,
            phone
        });

        const person = await Form.create({
            first_name,
            last_name,
            birth_date,
            age, // Ahora debería funcionar porque está en el modelo
            profession,
            address,
            phone,
            photo_url,
        });

        console.log('Persona creada en DB:', person.toJSON());

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

        if (!person) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }

        // Calcular nueva edad si se actualiza la fecha de nacimiento
        let age = person.age; // Mantener la edad actual por defecto

        if (birth_date) {
            console.log('Recalculando edad para actualización...');
            const [birthYear, birthMonth, birthDay] = birth_date.split('-').map(num => parseInt(num));

            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            age = currentYear - birthYear;

            if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
                age--;
            }

            console.log(`Nueva edad calculada: ${age}`);
        }

        await person.update({
            first_name,
            last_name,
            birth_date,
            age, // Actualizar la edad
            profession,
            address,
            phone,
            photo_url,
        });

        return res.json({
            message: "Persona actualizada exitosamente",
            data: person
        });
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