const mongoose = require('mongoose');
const { seedDatabaseIfEmpty } = require('../seed/seedHelper');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.log(`Local MongoDB not running on 27017 (${error.message}). Booting In-Memory Database Fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Database Connected: ${conn.connection.host}`);
      await seedDatabaseIfEmpty();
    } catch (memErr) {
      console.error('Database connection error:', memErr.message);
    }
  }
};

module.exports = connectDB;
