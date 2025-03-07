const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/plateforme_cours');
    console.log('MongoDB connected for course-service');
  } catch (err) {
    console.error('MongoDB connection error for course-service:', err);
    process.exit(1);
  }
};

module.exports = connectDB;