const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Drug entity
const userPrescriptionSchema = new Schema({
  // Field for drug name, must be a string and is required
  user: {
    type: Schema.Types.ObjectId, // Specifies that it should be an ObjectID
    ref: "User",
  },
  // Array of product IDs associated with this drug
  prescriptions: [
    {
      type: Schema.Types.ObjectId, // Specifies that it should be an ObjectID
      ref: "Prescription", // References the Product model
    },
  ],
});

// Creating a Mongoose model based on the schema, named "Drug"
module.exports = mongoose.model("UserPrescription", userPrescriptionSchema);
