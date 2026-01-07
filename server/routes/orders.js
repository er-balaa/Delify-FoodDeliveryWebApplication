const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Get all orders (Admin)
router.get('/admin/all', async (req, res) => {
    try {
        console.log("GET /api/orders/admin/all called");
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('restaurant', 'name image');
        console.log(`Found ${orders.length} orders`);
        res.json(orders);
    } catch (err) {
        console.error("Error in GET /orders/admin/all:", err);
        res.status(500).send('Server Error');
    }
});

// Update order status/details (Admin/Vendor)
router.put('/:id/status', async (req, res) => {
    const { status, estimatedDeliveryTime } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (estimatedDeliveryTime) updateFields.estimatedDeliveryTime = estimatedDeliveryTime;

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        ).populate('user', 'name email').populate('restaurant', 'name image');

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Emit real-time update
        if (req.io) {
            // We need to find the user's firebaseUid to emit to their room. 
            // The order.user is populated, so it has ._id, .name, .email. 
            // We need to fetch the original User doc to get firebaseUid implies explicit search or populate it.
            // Let's populate 'user' fully to access firebaseUid.

            const fullUser = await User.findById(order.user._id);
            if (fullUser) {
                req.io.to(fullUser.firebaseUid).emit('order_updated', order);
            }
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create new order
router.post('/', async (req, res) => {
    const { user, restaurant, items, totalAmount, deliveryAddress } = req.body;

    try {
        // user coming from frontend is firebaseUid, find db _id
        const userDoc = await User.findOne({ firebaseUid: user });
        if (!userDoc) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // AUTO-SAVE ADDRESS: Update User Address if provided
        if (deliveryAddress) {
            await User.findByIdAndUpdate(userDoc._id, { address: deliveryAddress });
        }

        if (!restaurant || !items || items.length === 0 || !totalAmount || !deliveryAddress) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        const newOrder = new Order({
            user: userDoc._id,
            restaurant,
            items,
            totalAmount,
            deliveryAddress
        });

        const order = await newOrder.save();

        // Notify Admins
        if (req.io) {
            req.io.emit('new_order_admin', order);
            // Notify Specific Restaurant Vendor
            req.io.to(restaurant).emit('new_vendor_order', order);
        }

        res.json(order);

        // Simulation of real-time updates
        const orderId = order._id;
        const userUid = user; // firebaseUid passed in body

        const updateStatus = async (status, delay) => {
            setTimeout(async () => {
                try {
                    const updatedOrder = await Order.findByIdAndUpdate(
                        orderId,
                        { status },
                        { new: true }
                    ).populate('restaurant', 'name image').populate('items.menuItem', 'name price description');

                    if (updatedOrder && req.io) {
                        req.io.to(userUid).emit('order_updated', updatedOrder);
                    }
                } catch (err) {
                    console.error("Simulation error", err);
                }
            }, delay);
        };

        // Timeline: Preparing (5s), Out (15s), Delivered (30s)
        updateStatus('preparing', 5000);
        updateStatus('out_for_delivery', 15000);
        updateStatus('delivered', 30000);


    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get user orders
router.get('/user/:firebaseUid', async (req, res) => {
    try {
        const userDoc = await User.findOne({ firebaseUid: req.params.firebaseUid });
        if (!userDoc) {
            // If user never logged in or synced, they have no orders
            return res.json([]);
        }

        const orders = await Order.find({ user: userDoc._id })
            .sort({ createdAt: -1 })
            .populate('restaurant', 'name image')
            .populate('items.menuItem', 'name price description');

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Vendor Dashboard Data
router.get('/vendor/:firebaseUid/dashboard', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Find restaurant owned by this user (Validate by Email first as per requirements, then ID)
        const restaurant = await require('../models/Restaurant').findOne({
            $or: [
                { ownerEmail: user.email },
                { owner: user._id }
            ]
        });

        if (!restaurant) {
            return res.json({
                restaurant: null,
                orders: [],
                stats: { totalOrders: 0, activeOrders: 0, completedOrders: 0, totalRevenue: 0 }
            });
        }

        // Find orders for this restaurant
        const orders = await Order.find({ restaurant: restaurant._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price');

        const stats = {
            totalOrders: orders.length,
            activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
            completedOrders: orders.filter(o => o.status === 'delivered').length,
            totalRevenue: orders
                .filter(o => o.status !== 'cancelled')
                .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
        };

        res.json({
            restaurant,
            orders,
            stats
        });

    } catch (err) {
        console.error("Error in Vendor Dashboard:", err);
        res.status(500).send('Server Error');
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json({ msg: 'Order removed' });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
