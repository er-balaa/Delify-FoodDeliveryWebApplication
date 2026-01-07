const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'out_of_stock'],
        default: 'placed',
    },
    estimatedDeliveryTime: {
        type: String, // Set by restaurant owner
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
