const express = require('express');
const mongoose = require('mongoose');
const Student = require('./student');
const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const app = express();

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/student/all', async (req, res) => {
    try {
        const result = await Student.find();
        if (!result) {
            res.status(404).json({ error: "No students found" });
        }
        res.json({ result });
    } catch (error) {
        console.log(error);
        res.status(500).json({error : error.message});
    }
});

app.get('/api/student/:id', async (req, res) => { // could do /api/students/:id/:name
    // res.json({ requestParams: req.params,
    //     requestQuery: req.query });
    // console.log({ requestParams: req.params,
    //     requestQuery: req.query });
    // const {id: studentId} = req.params;   takes the value of id and assigns it to studentId
    try{
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        // console.log(student);
        if (!student) {
            res.status(404).json({ error: "Student not found" });
        }
        res.json({ student });
    }
    catch(error){
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post('/api/student/create', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send('Student added successfully');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/student/clear', async (req, res) => {
    try {
        // Delete all documents from the Student collection
        const result = await Student.deleteMany({});
        res.status(200).json({ message: 'Database cleared successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/', (req, res) => {
    res.send('This is a post request!');
});


const start = async () => {
    try{
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();
