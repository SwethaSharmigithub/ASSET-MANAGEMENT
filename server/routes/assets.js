const express = require('express');
const Asset = require('../models/asset');
const router = express.Router();

// Get all assets
router.get('/', async (req, res) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets' });
    }
});

// Add a new asset
router.post('/', async (req, res) => {
    const { name, type, brand, model, serialNumber, value } = req.body;
    try {
        const newAsset = new Asset({ name, type, brand, model, serialNumber, value });
        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        res.status(400).json({ message: 'Error adding asset' });
    }
});

// Update an asset
router.put('/:id', async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(asset);
    } catch (error) {
        res.status(400).json({ message: 'Error updating asset' });
    }
});

// Delete an asset
router.delete('/:id', async (req, res) => {
    try {
        await Asset.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ message: 'Error deleting asset' });
    }
});

module.exports = router;
