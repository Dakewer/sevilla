import mongoose, {
    Schema
} from "mongoose";

const studentsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        match: /@/
    },
    expedient: {
        type: Number,
        required: true,
        unique: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
});

const Alumno = mongoose.model("students", studentsSchema);

// taer
export const getStudents = async () => {
    return await Alumno.find({});
};

// eliminar
export const deleteStudent = async (expedient: number) => {
    return await Alumno.deleteOne({
        expedient
    });
};

// Crear o actualizar
export const bothStudent = async (studentData: any) => {
    return await Alumno.findOneAndUpdate({
            expedient: studentData.expedient
        },
        studentData, {
            upsert: true,
            new: true
        }
    );
};