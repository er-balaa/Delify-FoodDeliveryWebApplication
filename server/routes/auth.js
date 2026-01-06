const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sync User from Firebase Login
router.post('/sync', async (req, res) => {
    const { firebaseUid, email, name } = req.body;

    try {
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = new User({
                firebaseUid,
                email,
                name,
                role: email === 'delifyadmin@gmail.com' ? 'admin' : 'customer'
            });
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get current user profile
router.get('/:firebaseUid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update User Address
router.put('/:firebaseUid', async (req, res) => {
    const { address } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.params.firebaseUid },
            { address },
            { new: true }
        );
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
