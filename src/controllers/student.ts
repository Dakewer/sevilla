import { Request, Response } from 'express';
import mongoose from 'mongoose';
import student from '../dataBase/index';

function createStudent(req: Request, res: Response): void {
    try {
        let name = req.body.name,
            email = req.body.email,
            expedient = req.body.expedient,
            semester = req.body.semester;

        if (!name || !email || !expedient || !semester)
            res.status(400).send("Error: One or more parameters are missing.");
        else if(semester >= 11 || semester <= 0)
            res.status(400).send("Error: Invalid semester");
        else {
            student.findOne({ expedient }).then((docs: any) => {
                if(docs)
                    res.status(409).send("An student with this expedient already exists");
                else {
                    let newStudentMongoose = new student({ name, email, expedient, semester });
                    newStudentMongoose.save().then((doc: any) => {
                        res.status(200).send(doc._id);
                    });
                }
            }).catch((err: Error) => { res.status(500).send("Error:" + err.message) });
        }
    } catch(err) {
        res.status(500).send("Error:" + (err as Error).message);
    }
}

function getStudentInfo(req: Request, res: Response): void {
    student.findOne({ _id: req.params.id })
        .then((result: any) => {
            if(result)
                res.status(200).send(result);
            else
                res.status(404).send({ "Error": "student not found." });
        }).catch((err: Error) => { res.status(500).send({ "Error": err.message }) });
}

function editStudentInfo(req: Request, res: Response): void {
    try {
        let id = req.params.id;
        let validAttributes = ["name", "email", "semester"];
        let updateData: Record<string, any> = {};

        for (let attribute in req.body) {
            if (validAttributes.includes(attribute)) {
                if (req.body[attribute] == "") continue;
                updateData[attribute] = req.body[attribute];
            } else {
                res.status(400).send({ "Error": `Attribute ${attribute} is not part of the student schema.` });
                return;
            }
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).send({ "Error": "No attributes were provided." });
            return;
        }
        student.findByIdAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        ).then((result: any) => {
            if (result)
                res.status(200).send(result);
            else
                res.status(404).send({ "Error": "student not found." });
        });
    } catch(err) {
        res.status(500).send({ "Error": (err as Error).message });
    }
}

function deleteStudent(req: Request, res: Response): void {
    let id = req.params.id;
    student.findByIdAndDelete(id)
        .then((result: any) => {
            if (result)
                res.status(200).json({ message: 'student deleted succesfully', student: result });
            else
                res.status(404).send({ "Error": "student not found." });
        }).catch((err: Error) => { res.status(500).send({ "Error": err.message }) });
}