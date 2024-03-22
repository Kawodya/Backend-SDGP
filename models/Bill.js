// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Drug entity
const billSchema = new Schema({
  // Price of the product, must be a number and is required
  total: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        // Validate that the value is a number
        return !isNaN(value);
      },
      message: "Total must be a number",
    },
  },
  // Array of medicines in the bill
  medicines: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            // Validate that the value is a number
            return !isNaN(value);
          },
          message: "Quantity must be a number",
        },
      },
      price: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            // Validate that the value is a number
            return !isNaN(value);
          },
          message: "Price must be a number",
        },
      },
    },
  ],
});

// Creating a Mongoose model based on the schema, named "Drug"
module.exports = mongoose.model("Bill", billSchema);
