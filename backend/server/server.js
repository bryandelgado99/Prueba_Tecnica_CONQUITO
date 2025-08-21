import 'dotenv/config';

import express from 'express';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import formRouter from '../routes/form.routes.js';
import dashboardRouter from '../routes/dashboard.routes.js';
import connectDB from "../database/connection.js";

const app = express();
const port = process.env.PORT || 4000;

// Para el renderizado de archivos PUG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar PUG
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Rutas
app.use('/api/form', formRouter);
app.use('/api/dashboard', dashboardRouter);

// Manejo de ruta no encontrada
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Página no encontrada",
        message: "El recurso que buscas no existe (Error 404)."
    });
});

// Inicializamos el server
export const startServer = async () => {
    try {
        const sequelize = await connectDB();
        await sequelize.sync();
        console.log("✅ Tablas sincronizadas");

        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
};

export default app;