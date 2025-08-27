const mongoose = require("mongoose");

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = DBConnection;
