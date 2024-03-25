// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Prescription entity
const prescriptionSchema = new Schema({
  code: {
    type: String,
  },
  user_name: {
    type: String,
  },
  age: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: String,
    // type: Date,
    // default: Date.now,
  },
  // Array of medicines in the bill
  medicines: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      user_instruction: {
        type: String,
      },
    },
  ],
});

// Creating a Mongoose model based on the schema, named "Prescription"
module.exports = mongoose.model("Prescription", prescriptionSchema);
