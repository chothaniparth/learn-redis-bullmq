const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
}
module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose.