// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'employee', 'asset-manager'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
