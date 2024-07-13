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

app.get('/api/student/:id', async (req, res) => {
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

app.patch('/api/student/:id/schedule', async (req, res) => {
    const { id } = req.params;
    const { date, price } = req.body;

    if (!date || !price) {
        return res.status(400).json({ error: 'Date and price are required' });
    }

    const newSession = {
        date,
        price,
        status: 'requested',
        paid: false,
        notes: ' ',
        receipt: ' '
    };

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        else {
            student.sessions.push(newSession);
            await student.save();
            res.json({ student });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error });
    }
});


app.post('/api/student/clear', async (req, res) => {
    try {

    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/', (req, res) => {
    res.send('This is a post request!');
});


const start = async () => {
    const startTime = process.hrtime();

    try {
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
            const { version } = require('./package.json'); // Getting the version from package.json

            const elapsedTime = process.hrtime(startTime); // Calculate elapsed time
            const elapsedTimeMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6; // Convert to milliseconds

            console.log();
            console.log(` \x1b[1m\x1b[31m EXPRESS \x1b[0m${version ? '\x1b[31mv' + version + ' ' : ''}\x1b[90m ready in \x1b[0m\x1b[1m\x1b[37m${elapsedTimeMs.toFixed(0)}\x1b[0m\x1b[37m ms \x1b[0m`);
            console.log(` \x1b[1m\x1b[31m ➜ \x1b[0m\x1b[1m\x1b[37m Local:   \x1b[0m\x1b[36m${url.substring(0, url.lastIndexOf(':'))}:\x1b[1m${PORT}\x1b[0m\x1b[36m/`);
            console.log("\x1b[0m");
            
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
