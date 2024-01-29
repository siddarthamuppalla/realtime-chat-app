const mongoose = require('mongoose');

// establish connection

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected.");
    } catch (error) {
        console.log('MongoDB Error: ', error);
    };
};

module.exports = connectToDb;
