// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Drug entity
const drugSchema = new Schema({
  // Field for drug name, must be a string and is required
  drug_name: {
    type: String,
    required: true,
  },
  // Array of product IDs associated with this drug
  products: [
    {
      type: Schema.Types.ObjectId, // Specifies that it should be an ObjectID
      ref: "Product", // References the Product model
    },
  ],
});

// Creating a Mongoose model based on the schema, named "Drug"
module.exports = mongoose.model("Drug", drugSchema);
