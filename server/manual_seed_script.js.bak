const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});

        const ownerId = new mongoose.Types.ObjectId();

        const restaurants = [
            {
                name: 'Burger King',
                description: 'The Home of the Whopper',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
                cuisine: ['Burger', 'American', 'Fast Food'],
                address: 'Connaught Place, New Delhi',
                rating: 4.2,
                deliveryTime: '25-30 min',
                priceForTwo: 350,
                owner: ownerId
            },
            {
                name: 'Pizza Hut',
                description: 'Tastiest Pizzas in Town',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                cuisine: ['Pizza', 'Italian'],
                address: 'Saket, New Delhi',
                rating: 4.0,
                deliveryTime: '40-45 min',
                priceForTwo: 500,
                owner: ownerId
            },
            {
                name: 'Sushi World',
                description: 'Authentic Japanese Cuisine',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
                cuisine: ['Sushi', 'Japanese'],
                address: 'Vasant Kunj, New Delhi',
                rating: 4.7,
                deliveryTime: '30-40 min',
                priceForTwo: 800,
                owner: ownerId
            },
            {
                name: 'Taco Bell',
                description: 'Craving Tacos?',
                image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
                cuisine: ['Mexican', 'Fast Food'],
                address: 'Nehru Place, New Delhi',
                rating: 4.1,
                deliveryTime: '35-45 min',
                priceForTwo: 400,
                owner: ownerId
            },
            {
                name: 'Bikanervala',
                description: 'Traditional Indian Sweets and Snacks',
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&q=80',
                cuisine: ['Indian', 'Street Food'],
                address: 'Karol Bagh, New Delhi',
                rating: 4.5,
                deliveryTime: '40-50 min',
                priceForTwo: 600,
                owner: ownerId
            },
            {
                name: 'The Belgium Waffle Co.',
                description: 'Waffle Heaven',
                image: 'https://images.unsplash.com/photo-1551024601-5637ade9b806?w=800&q=80',
                cuisine: ['Desserts', 'Waffles'],
                address: 'Hauz Khas, New Delhi',
                rating: 4.8,
                deliveryTime: '20-30 min',
                priceForTwo: 250,
                owner: ownerId
            },
            {
                name: 'KFC',
                description: 'Finger Lickin Good',
                image: 'https://images.unsplash.com/photo-1513639776629-9269d0d5ce39?w=800&q=80',
                cuisine: ['Fried Chicken', 'American'],
                address: 'CP, New Delhi',
                rating: 4.3,
                deliveryTime: '30-35 min',
                priceForTwo: 550,
                owner: ownerId
            },
            {
                name: 'Haldiram',
                description: 'Taste of Tradition',
                image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
                cuisine: ['North Indian', 'Sweets'],
                address: 'Chandni Chowk, New Delhi',
                rating: 4.6,
                deliveryTime: '40-50 min',
                priceForTwo: 400,
                owner: ownerId
            },
            {
                name: 'Dominos',
                description: 'Dil, Dosti, Domino\'s',
                image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80',
                cuisine: ['Pizza', 'Fast Food'],
                address: 'Dwarka, New Delhi',
                rating: 4.1,
                deliveryTime: '30 min',
                priceForTwo: 450,
                owner: ownerId
            },
            {
                name: 'Chaayos',
                description: 'Meri Wali Chai',
                image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=800&q=80',
                cuisine: ['Cafe', 'Tea'],
                address: 'Cyber Hub, Gurgaon',
                rating: 4.4,
                deliveryTime: '20-30 min',
                priceForTwo: 300,
                owner: ownerId
            }
        ];

        const createdRestaurants = await Restaurant.insertMany(restaurants);

        let menuItems = [];

        // Helper to add menu items
        const addItems = (restIndex, items) => {
            if (createdRestaurants[restIndex]) {
                items.forEach(item => {
                    menuItems.push({
                        restaurant: createdRestaurants[restIndex]._id,
                        ...item
                    });
                });
            }
        };

        // 1. Burger King
        addItems(0, [
            { name: 'Whopper', description: 'Flame-grilled beef patty', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
            { name: 'Chicken Fries', description: 'Crispy chicken strips', price: 149, category: 'Sides', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80' }
        ]);

        // 2. Pizza Hut
        addItems(1, [
            { name: 'Margherita', description: 'Classic cheese pizza.', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
            { name: 'Pepperoni', description: 'Loaded with pepperoni.', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' }
        ]);

        // 3. Sushi World
        addItems(2, [
            { name: 'Salmon Roll', description: 'Fresh salmon with rice.', price: 499, category: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
            { name: 'Tuna Sashimi', description: 'Raw tuna slices.', price: 599, category: 'Sashimi', image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80' }
        ]);

        // 4. Taco Bell
        addItems(3, [
            { name: 'Crunchy Taco', description: 'Seasoned beef in corn shell.', price: 99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80' },
            { name: 'Burrito Supreme', description: 'Large flour tortilla with everything.', price: 199, category: 'Burritos', image: 'https://images.unsplash.com/photo-1566740933430-b5559329228f?w=500&q=80' }
        ]);

        // 5. Bikanervala
        addItems(4, [
            { name: 'Raj Kachori', description: 'King of all kachoris.', price: 140, category: 'Chaat', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
            { name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread.', price: 180, category: 'Main', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80' }
        ]);

        // 6. Belgium Waffle
        addItems(5, [
            { name: 'Nutella Waffle', description: 'Waffle loaded with Nutella.', price: 160, category: 'Waffles', image: 'https://images.unsplash.com/photo-1551024601-5637ade9b806?w=500&q=80' },
            { name: 'Red Velvet', description: 'Red velvet waffle base.', price: 170, category: 'Waffles', image: 'https://images.unsplash.com/photo-1622320146033-030ec6948512?w=500&q=80' }
        ]);

        // 7. KFC
        addItems(6, [
            { name: 'Bucket of Chicken', description: '12 pieces of fried chicken.', price: 699, category: 'Bucket', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80' },
            { name: 'Zinger Burger', description: 'Classic chicken burger.', price: 179, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' }
        ]);

        // 8. Haldiram
        addItems(7, [
            { name: 'Thali', description: 'Complete meal.', price: 250, category: 'Main', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80' },
            { name: 'Rasgulla', description: 'Sweet spongy balls.', price: 80, category: 'Sweets', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500&q=80' }
        ]);

        // 9. Dominos
        addItems(8, [
            { name: 'Farmhouse', description: 'Pizza with veggies.', price: 450, category: 'Pizza', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&q=80' },
            { name: 'Choco Lava Cake', description: 'Molten chocolate cake.', price: 99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500&q=80' }
        ]);

        // 10. Chaayos
        addItems(9, [
            { name: 'Desi Chai', description: 'Authentic Indian Tea.', price: 120, category: 'Tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80' },
            { name: 'Bun Maska', description: 'Bun with butter.', price: 80, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&q=80' }
        ]);

        await MenuItem.insertMany(menuItems);
        console.log('Database Seeded Successfully with 10 Restaurants');
        process.exit();

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
