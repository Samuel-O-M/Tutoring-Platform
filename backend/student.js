const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['requested', 'confirmed', 'done']    
    },
    paid: {
        type: Boolean,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    }
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: ['e', 's']
    },
    meetLink: {
        type: String,
        required: true
    },
    whiteboardLink: {
        type: String,
        required: true
    },
    sessions: {
        type: [sessionSchema],
        required: false,
        default: []
    }
});

module.exports = mongoose.model('Student', studentSchema);
// here collection = students as part of database.collection