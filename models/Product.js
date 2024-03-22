// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Product entity
const productSchema = new Schema({
  // Reference to the Brand model
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  // Reference to the Drug model
  drug: {
    type: Schema.Types.ObjectId,
    ref: "Drug",
  },
  // Price of the product, must be a number and is required
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
  // Quantity of the product, must be a number and is required
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
  // Dosage of the product, must be a string and is required
  dosage: {
    type: String,
    required: true,
  },
  // Special instructions for the product, optional
  special_instruction: {
    type: String,
  },
});

// Creating a Mongoose model based on the schema, named "Product"
module.exports = mongoose.model("Product", productSchema);
