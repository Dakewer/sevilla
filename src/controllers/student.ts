// Importaciones
const mongoose = require('mongoose');
const student = require('../dataBase/index.js');
const {response} = require("express");

// Funciones
function createStudent(req, res) {
    try {
        let name = req.body.name,
            email = req.body.email,
            expedient = req.body.expedient,
            semester = req.body.semester;
        if (!name || !email || !expedient || !semester)
            res.status(400).send("Error: One or more parameters are missing.");
        else if(semester >= 11 || semester <= 0)
            res.status(400).send("Error: Invalid semester");
        else{
            student.findOne({
                expedient: expedient
            }).then((docs) => {
                if(docs)
                    res.status(409).send("An student with this expedient already exists");
                else {
                    let newStudent = {
                        name: name,
                        email: email,
                        expedient: expedient,
                        semester: semester
                    }
                    let newStudentMongoose = student(newStudent);
                    newStudentMongoose.save().then((doc) => {
                        const studentID = doc._id;
                        res.status(200).send(studentID);
                    });
                }
            }).catch((err) => {res.status(500).send("Error:" + err.message)});
        }
    } catch(err){
        res.status(500).send("Error:" + err.message);
    }
}

function getStudentInfo(req, res) {
    student.findOne({
        _id: req.params.id
    }).then((response) => {
        if(response)
            res.status(200).send(response);
        else
            res.status(404).send({"Error": "student not found."});
    }).catch((err) => {res.status(500).send({"Error": err.message})});
}

function editStudentInfo(req, res) {
    try {
        let id = req.params.id;
        let validAttributes = ["name","email", "semester"];
        let updateData = {};
        for (let attribute in req.body) {
            if (validAttributes.includes(attribute)){
                if (req.body[attribute] == "") continue;
            }
            else
                return res.status(400).send({"Error": `Attribute ${attribute} is not part of the student schema.`});
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({"Error": "No attributes were provided."});
        }
        student.findByIdAndUpdate(
            {_id: id},
            {$set: updateData},
            {new: true, runValidators: true}
        ).then((response) => {
            if (response) {
                res.status(200).send(response);
            } else {
                res.status(404).send({"Error": "student not found."});
            }
        })
    } catch(err) {
        res.status(500).send({"Error": err.message});
    }
}

function deleteStudent(req, res) {
    let id = req.params.id;
    student.findByIdAndDelete(id).then((response) => {
        if (response)
            res.status(200).json({message: 'student deleted succesfully', student: response});
        else
            res.status(404).send({"Error": "student not found."});
    }).catch((err) => {res.status(500).send({"Error": err.message})});
}