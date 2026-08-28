const mongoose = require('mongoose');
const { seedDatabaseIfEmpty } = require('../seed/seedHelper');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure MongoDB is running locally at mongodb://localhost:27017 or update MONGO_URI in backend/.env');
  }
};

module.exports = connectDB;
