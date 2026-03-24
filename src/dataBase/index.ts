import { config } from "dotenv";
config();
import mongoose from 'mongoose';
import studentsSchema from '../dataBase/student.model';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("No se encontró la url en el .env");
        }

        await mongoose.connect(uri);
        console.log("Se logró conectar a la DB");
    } catch (error) {
        console.error('Error crítico al conectar a la base de datos:', error);
        process.exit(1);
    }
};