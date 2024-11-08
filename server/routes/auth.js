const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route for user registration
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password, // Plain text password (not recommended for production)
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (email already exists)
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password (as plain text)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Successful login, return user details including role
        res.status(200).json({ 
            message: 'Login successful', 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role // Include role in response
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// // Route for getting all users
// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users', error });
//     }
// });

// // Route for updating a user
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, email, password, role } = req.body;

//     try {
//         const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, role }, { new: true });
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating user', error });
//     }
// });

// // Route for deleting a user
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         await User.findByIdAndDelete(id);
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting user', error });
//     }
// });

module.exports = router;
