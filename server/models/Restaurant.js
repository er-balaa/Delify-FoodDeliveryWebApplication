const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    ownerEmail: {
        type: String, // Explicitly store owner email for validation
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String, // URL
    },
    cuisine: {
        type: [String],
    },
    address: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    deliveryTime: {
        type: String, // e.g., "30-40 min"
    },
    priceForTwo: {
        type: Number,
    },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
