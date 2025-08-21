// models/Person.js - USAR ESTE
import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

const Form = sequelize.define(
    "Person",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        profession: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                len: [7, 20],
            },
        },
        photo_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "persons",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default Form;