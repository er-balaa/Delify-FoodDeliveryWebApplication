const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'restaurant_owner', 'admin'],
        default: 'customer',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);
