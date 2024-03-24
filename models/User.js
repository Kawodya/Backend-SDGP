// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the User entity
const userSchema = new Schema({
  // Email of the user, must be a string and is required
  email: {
    type: String,
    required: true,
  },
  // First name of the user, must be a string and is required
  first_name: {
    type: String,
    required: true,
  },
  // Last name of the user, must be a string and is required
  last_name: {
    type: String,
    required: true,
  },
  // Full name of the user, must be a string and is required
  name: {
    type: String,
    required: true,
  },
  // Address of the user, optional
  address: {
    type: String,
  },
  // Password of the user, must be a string and is required
  password: {
    type: String,
    required: true,
  },
  // Array of roles for the user
  roles: [
    {
      // Role of the user, must be one of the specified enums and is required
      role: {
        type: String,
        enum: ["doctor", "patient", "pharmacist"],
        required: true,
      },
      // Additional field for doctor and pharmacist, must be a string and required based on the role
      uniqueId: {
        type: String,
        required: function () {
          return this.role === "doctor" || this.role === "pharmacist";
        },
      },

      longtitude: {
        type: String,
        required: function () {
          return this.role === "pharmacist";
        },
      },
      latitude: {
        type: String,
        required: function () {
          return this.role === "pharmacist";
        },
      },
      // Additional field for patient, must be a string and required based on the role
      // age: {
      //   type: String,
      //   required: function () {
      //     return this.role === "patient";
      //   },
      // },
      // Additional field for patient, must be a string and required based on the role
      district: {
        type: String,
        required: function () {
          return this.role === "pharmacist";
        },
      },
    },
  ],
});

// Creating a Mongoose model based on the schema, named "User"
module.exports = mongoose.model("User", userSchema);
