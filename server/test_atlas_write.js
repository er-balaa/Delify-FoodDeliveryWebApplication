const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');

dotenv.config({ path: 'server/.env' });

console.log("⏳ Connecting to MongoDB Atlas...");
if (!process.env.MONGO_URI) { console.error("❌ MONGO_URI not found in environment!"); process.exit(1); }
console.log(`📡 URI: ${process.env.MONGO_URI.split('@')[1]}`); // Log only host part for security

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to Atlas. Performing Write Test...');

        // 1. Create Test Entry
        const testRest = new Restaurant({
            name: "Atlas Connectivity Test " + Date.now(),
            address: "Test Address",
            ownerEmail: "test@verification.com",
            description: "Temporary verification entry",
            owner: new mongoose.Types.ObjectId() // Random ID
        });

        const saved = await testRest.save();
        console.log(`\n🎉 WRITE SUCCESS: Saved document to 'restaurants' collection.`);
        console.log(`🆔 Document ID: ${saved._id}`);
        console.log(`📝 Name: ${saved.name}`);

        // 2. Cleanup
        await Restaurant.findByIdAndDelete(saved._id);
        console.log(`\n🗑️ CLEANUP SUCCESS: Test document deleted.`);

        console.log("\n🚀 CONCLUSION: The application is correctly configured to Read/Write directly to MongoDB Atlas.");
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ CONNECTION/WRITE FAILED:', err);
        process.exit(1);
    });
