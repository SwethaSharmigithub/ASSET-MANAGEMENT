const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    serialNumber: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Asset', assetSchema);
