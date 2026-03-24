"use strict";
import { config } from "dotenv"
config();
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("No se encontro la url en el .env");
        }

        await mongoose.connect(uri);
        console.log("Se logro Yei");
    } catch (error) {
        // Es mejor ver el error real que solo decir "muerte fatal" para debuguear
        console.error('Error crítico al conectar a la base de datos:', error);
        process.exit(1);
    }
};
