import { Sequelize } from "sequelize";

const connectionString = `postgresql://${process.env.POSTGRESQL_DB_USERNAME}:${process.env.POSTGRESQL_DB_PASSWORD}@localhost:5432/${process.env.POSTGRESQL_DB_NAME}`;

export const sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    logging: false,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión a PostgreSQL establecida correctamente.");
        return sequelize;
    } catch (error) {
        console.error("❌ Error al conectar a PostgreSQL:", error);
        throw error;
    }
};

export default connectDB;