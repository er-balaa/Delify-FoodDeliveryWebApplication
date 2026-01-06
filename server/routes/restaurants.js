const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        console.log("GET /api/restaurants called");
        const restaurants = await Restaurant.find().populate('owner', 'name');
        console.log(`Found ${restaurants.length} restaurants from DB`);
        res.json(restaurants);
    } catch (err) {
        console.error("Error in GET /restaurants:", err);
        res.status(500).send('Server Error');
    }
});

// Add new restaurant (Admin)
router.post('/', async (req, res) => {
    try {
        // Automatically assign to the admin user
        let owner = await User.findOne({ email: 'delifyadmin@gmail.com' });

        // Fallback if admin user doesn't exist in DB (shouldn't happen if logged in)
        if (!owner) {
            owner = await User.findOne({}); // Just pick first user as fallback for safety
        }

        const newRestaurant = new Restaurant({
            ...req.body,
            owner: owner ? owner._id : null
        });

        const restaurant = await newRestaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error("Error adding restaurant:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// Update restaurant details (Admin)
router.put('/:id', async (req, res) => {
    try {
        console.log(`PUT /api/restaurants/${req.params.id} called`);
        console.log("Update Data:", req.body);

        if (req.body.cuisine && typeof req.body.cuisine === 'string') {
            req.body.cuisine = req.body.cuisine.split(',').map(c => c.trim());
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        console.log("Restaurant updated successfully");
        res.json(updatedRestaurant);
    } catch (err) {
        console.error("Error updating restaurant:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get single restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name');
        if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get menu for a restaurant
router.get('/:id/menu', async (req, res) => {
    try {
        const menu = await MenuItem.find({ restaurant: req.params.id });
        res.json(menu);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add menu item (Admin)
router.post('/:id/menu', async (req, res) => {
    try {
        const menuItem = new MenuItem({
            restaurant: req.params.id,
            ...req.body
        });
        const savedItem = await menuItem.save();
        res.json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
