const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');

// Get Cart for User
router.get('/:firebaseUid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            // Return empty structure if no cart yet
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Cart (Merge/Sync)
router.post('/', async (req, res) => {
    const { firebaseUid, restaurantId, restaurantName, items } = req.body;

    try {
        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({
                user: user._id,
                restaurant: restaurantId,
                restaurantName,
                items
            });
        } else {
            // Logic: If restaurant differs, replace cart. If same, update items.
            // For simplicity in this "sync", we usually trust the client's latest state 
            // OR we implement add/remove item logic here.
            // Given the Context-based approach, replacing the state with the client's current active cart is easiest.

            cart.restaurant = restaurantId;
            cart.restaurantName = restaurantName;
            cart.items = items;
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
