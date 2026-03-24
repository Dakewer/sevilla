import mongoose from "mongoose";

const alumnoSchema = new Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, match: /@/ },
    expediente: { type: Number, required: true },
    semestre: { type: Number, required: true, min: 1, max: 10 }
});

const alumno = mongoose.model("alumno", alumnoSchema);
