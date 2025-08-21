// controllers/dashboardController.js
import { Sequelize } from "sequelize";
import Form from "../database/models/form.model.js";

// 1. Personas por profesión
export const getpersonsByProfession = async (req, res) => {
    try {
        const data = await Form.findAll({
            attributes: [
                "profession",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
            ],
            group: ["profession"],
        });

        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener datos por profesión" });
    }
};

// 2. Distribución por rangos de edad
export const getpersonsByAgeRange = async (req, res) => {
    try {
        const persons = await Form.findAll({ attributes: ["birth_date"] });

        const ranges = {
            "0-18": 0,
            "19-35": 0,
            "36-60": 0,
            "60+": 0,
        };

        persons.forEach((p) => {
            const birthDate = new Date(p.birth_date);
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            if (age <= 18) ranges["0-18"]++;
            else if (age <= 35) ranges["19-35"]++;
            else if (age <= 60) ranges["36-60"]++;
            else ranges["60+"]++;
        });

        return res.json(ranges);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener datos por rango de edad" });
    }
};

// 3. Personas registradas por mes
export const getpersonsByMonth = async (req, res) => {
    try {
        const data = await Form.findAll({
            attributes: [
                [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("created_at")), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
            ],
            group: ["month"],
            order: [[Sequelize.literal("month"), "ASC"]],
        });

        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener datos por mes" });
    }
};
