const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/medilink");
    console.log("Connection succeeded");
  } catch (error) {
    console.error("Error in connection:", error);
  }
};

module.exports = connectDB;
