const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new employee
router.post('/', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an employee
router.put('/:id', async (req, res) => {
    try {
        console.log("Received update request for employee:", req.params.id);
        
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, email: req.body.email, role: req.body.role },
            { new: true }
        );
        
        // Check if the employee was found and updated
        if (!updatedEmployee) {
            console.log("Employee not found");
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        console.log("Employee updated successfully:", updatedEmployee);
        res.json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(400).json({ message: 'Error updating employee', error: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
