// Importing necessary modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for the Brand entity
const brandSchema = new Schema({
  // Field for brand name, must be a string and is required
  brand_name: {
    type: String,
    required: true,
  },
  // Array of product IDs associated with this brand
  products: [
    {
      type: Schema.Types.ObjectId, // Specifies that it should be an ObjectID
      ref: "Product", // References the Product model
    },
  ],
});

// Creating a Mongoose model based on the schema, named "Brand"
module.exports = mongoose.model("Brand", brandSchema);
