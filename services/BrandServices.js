const { default: mongoose } = require("mongoose");
const BrandModel = require("../models/Brand");
const { handleError } = require("../utils/sharedUtils");
const {
  Types: { ObjectId },
} = require("mongoose");

const getAllBrands = async () => {
  try {
    const brands = await BrandModel.find();
    return brands;
  } catch (error) {
    throw new Error(`Error fetching tags: ${error.message}`);
  }
};

const createBrand = async (data) => {
  try {
    const newBrand = new BrandModel({
      brand_name: data.brand_name,
      products: data.products || [],
    });

    await newBrand.save();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
};
