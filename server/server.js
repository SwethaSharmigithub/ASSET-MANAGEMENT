const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const employeeRoutes = require('./routes/employees');
const assetRoutes = require('./routes/assets'); 

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes); 
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);


// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/asset_management")
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('Error while connecting to MongoDB', err));


const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
